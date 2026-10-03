import Assessment from "../models/Assessment.js";
import RetirementAnalysis from "../models/RetirementAnalysis.js";
import User from "../models/user.js";

// @desc    Get all assessments across the platform
// @route   GET /api/admin/assessments
// @access  Private/Admin
export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({}).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    console.error("Error getting all assessments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all retirement analyses across the platform
// @route   GET /api/admin/retirement-analysis
// @access  Private/Admin
export const getAllRetirementAnalyses = async (req, res) => {
  try {
    const analyses = await RetirementAnalysis.find({}).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching all retirement analyses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
