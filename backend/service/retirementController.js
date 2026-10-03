import RetirementAnalysis from "../models/RetirementAnalysis.js";
import User from "../models/user.js";

// @desc    Get the current user's retirement analysis
// @route   GET /api/retirement-analysis
// @access  Private
export const getRetirementAnalysis = async (req, res) => {
  const userId = req.user.id || req.user._id;
  try {
    const analysis = await RetirementAnalysis.findOne({ userId }).sort({ createdAt: -1 });
    if (!analysis) {
      return res.status(404).json({ message: "No retirement analysis found" });
    }
    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error fetching retirement analysis:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Submit a retirement analysis
// @route   POST /api/retirement-analysis
// @access  Private
export const saveRetirementAnalysis = async (req, res) => {
  const { inputs, incomeCheckpoints, results, assessmentFor, otherName, otherRelation } = req.body;
  const userId = req.user.id || req.user._id;

  if (!inputs || !incomeCheckpoints || !results) {
    return res.status(400).json({ message: "Incomplete form data" });
  }

  try {
    // Save to database
    const analysis = await RetirementAnalysis.create({
      userId,
      inputs,
      incomeCheckpoints,
      results,
      assessmentFor,
      otherName,
      otherRelation,
    });

    // Update user to indicate retirement analysis completion
    await User.findByIdAndUpdate(userId, { hasCompletedRetirementAnalysis: true });

    res.status(201).json({
      message: "Retirement Analysis submitted successfully",
      data: analysis,
    });
  } catch (error) {
    console.error("Error submitting retirement analysis:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all retirement analyses for the user (History)
// @route   GET /api/retirement-analysis/history
// @access  Private
export const getUserRetirementAnalyses = async (req, res) => {
  const userId = req.user.id || req.user._id;
  try {
    const analyses = await RetirementAnalysis.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(analyses);
  } catch (error) {
    console.error("Error fetching retirement history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
