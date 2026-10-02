import Assessment from "../models/Assessment.js";
import User from "../models/User.js";

// Helper function to map score to risk category
const getRiskCategory = (score) => {
  if (score >= 10 && score <= 17) return "Conservative";
  if (score >= 18 && score <= 25) return "Moderately Conservative";
  if (score >= 26 && score <= 33) return "Moderate";
  if (score >= 34 && score <= 41) return "Moderately Aggressive";
  if (score >= 42) return "Aggressive"; // 42-48
  return "Unknown";
};

// @desc    Submit a new risk assessment
// @route   POST /api/assessment
// @access  Private
export const submitAssessment = async (req, res) => {
  const { answers, assessmentFor, otherName, otherRelation } = req.body;
  const userId = req.user.id || req.user._id;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "Answers are required" });
  }

  try {
    // Calculate total score
    const score = answers.reduce((total, answer) => total + (Number(answer.points) || 0), 0);
    const riskCategory = getRiskCategory(score);

    // Save assessment to database
    const assessment = await Assessment.create({
      userId,
      assessmentType: "Wealth_Client_Risk_Profiler",
      score,
      riskCategory,
      answers,
      assessmentFor,
      otherName,
      otherRelation,
    });

    // Update user to indicate assessment completion
    await User.findByIdAndUpdate(userId, { hasCompletedRiskAssessment: true });

    res.status(201).json({
      message: "Assessment submitted successfully",
      score,
      riskCategory,
      assessment,
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's latest assessment
// @route   GET /api/assessment
// @access  Private
export const getAssessment = async (req, res) => {
  const userId = req.user.id || req.user._id;

  try {
    const assessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({ message: "No assessment found" });
    }

    res.json(assessment);
  } catch (error) {
    console.error("Error getting assessment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all assessments for the user (History)
// @route   GET /api/assessment/history
// @access  Private
export const getUserAssessments = async (req, res) => {
  const userId = req.user.id || req.user._id;

  try {
    const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    console.error("Error getting assessments history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
