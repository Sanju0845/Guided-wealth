import express from "express";
import { submitAssessment, getAssessment, getUserAssessments } from "../service/assessmentController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitAssessment);
router.get("/", protect, getAssessment);
router.get("/history", protect, getUserAssessments);

export default router;
