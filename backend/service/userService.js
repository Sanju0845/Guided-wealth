import User from "../models/user.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name !== undefined ? req.body.name : user.name;
      user.email = req.body.email !== undefined ? req.body.email : user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.countryCode = req.body.countryCode !== undefined ? req.body.countryCode : user.countryCode;
      user.role = req.body.role !== undefined ? req.body.role : user.role;
      
      user.isDeleted = req.body.isDeleted !== undefined ? req.body.isDeleted : user.isDeleted;
      user.isBanned = req.body.isBanned !== undefined ? req.body.isBanned : user.isBanned;
      user.isPending = req.body.isPending !== undefined ? req.body.isPending : user.isPending;

      if (req.body.personalInfo) {
        user.personalInfo = {
          address: req.body.personalInfo.address !== undefined ? req.body.personalInfo.address : user.personalInfo?.address,
          dateOfBirth: req.body.personalInfo.dateOfBirth !== undefined ? req.body.personalInfo.dateOfBirth : user.personalInfo?.dateOfBirth,
          gender: req.body.personalInfo.gender !== undefined ? req.body.personalInfo.gender : user.personalInfo?.gender,
        };
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete user (Soft Delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Perform soft delete
      user.isDeleted = true;
      await user.save();
      res.json({ message: "User soft-deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.personalInfo) {
        user.personalInfo = {
          address: req.body.personalInfo.address !== undefined ? req.body.personalInfo.address : user.personalInfo?.address,
          dateOfBirth: req.body.personalInfo.dateOfBirth !== undefined ? req.body.personalInfo.dateOfBirth : user.personalInfo?.dateOfBirth,
          gender: req.body.personalInfo.gender !== undefined ? req.body.personalInfo.gender : user.personalInfo?.gender,
        };
      }

      // Explicitly ignoring fields that normal users shouldn't update
      // like role, isDeleted, isBanned, isPending

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isPending: updatedUser.isPending,
        personalInfo: updatedUser.personalInfo,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
