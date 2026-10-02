import mongoose from "mongoose";

const assessmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assessmentType: {
      type: String,
      required: true,
      default: "Wealth_Client_Risk_Profiler",
    },
    score: {
      type: Number,
      required: true,
    },
    riskCategory: {
      type: String,
      required: true,
    },
    assessmentFor: {
      type: String,
      default: "self",
    },
    otherName: {
      type: String,
    },
    otherRelation: {
      type: String,
    },
    answers: [
      {
        questionId: { type: Number, required: true },
        questionText: { type: String, required: true },
        selectedOption: { type: String, required: true },
        points: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
