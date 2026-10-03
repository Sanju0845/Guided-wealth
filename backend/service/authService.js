import User from "../models/user.js";
import jwt from "jsonwebtoken";
import admin from "./firebase.js";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Admin login using environment variables
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ message: "Admin credentials not configured in environment" });
  }

  if (email === adminEmail && password === adminPassword) {
    // Generate token with dummy admin ID or find/create an admin user in DB
    // We will just generate a token with 'admin' role
    res.json({
      _id: "admin_id_env",
      email: adminEmail,
      role: "admin",
      token: generateToken("admin_id_env", "admin"),
    });
  } else {
    res.status(401).json({ message: "Invalid admin email or password" });
  }
};

// @desc    Login/Register user via Firebase OTP Token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { firebaseToken, name } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ message: "Firebase token is required" });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number; // Firebase stores phone number here

    if (!phone) {
      return res.status(400).json({ message: "No phone number found in Firebase token" });
    }

    let user = await User.findOne({ phone });

    if (user) {
      if (user.isDeleted) {
        return res.status(403).json({ message: "Your account has been deleted. Please contact support." });
      }
      if (user.isBanned) {
        return res.status(403).json({ message: "Your account has been banned. Please contact support." });
      }
    }

    // If user doesn't exist, create one
    if (!user) {
      user = await User.create({
        phone,
        name: name || "User",
        role: "user", // Default role
        isPending: false, // Normal users shouldn't be pending
      });
    } else if (user.role === 'user' && user.isPending) {
      // Clear pending status for existing normal users
      user.isPending = false;
      await user.save();
    }

    // Generate our backend JWT for subsequent requests
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isPending: user.isPending,
      hasCompletedRiskAssessment: user.hasCompletedRiskAssessment,
      hasCompletedRetirementAnalysis: user.hasCompletedRetirementAnalysis,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(401).json({ message: "Invalid or expired Firebase token", error: error.message });
  }
};

// @desc    Pre-register partner or advisor by Admin
// @route   POST /api/auth/register-partner-advisor
// @access  Private/Admin
export const registerPartnerAdvisor = async (req, res) => {
  const { phone, countryCode, email, name, role } = req.body;

  if (!phone || !countryCode || !email || !name) {
    return res.status(400).json({ message: "Phone, countryCode, email, and name are required" });
  }

  if (!role || (role !== "advisor" && role !== "partner")) {
    return res.status(400).json({ message: "Valid role (advisor or partner) is required" });
  }

  try {
    let user = await User.findOne({ phone });

    if (user) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }

    user = await User.create({
      phone,
      countryCode,
      email,
      name,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
      role: user.role,
      hasCompletedRiskAssessment: user.hasCompletedRiskAssessment,
    });
  } catch (error) {
    console.error("Error creating partner/advisor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
