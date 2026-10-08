import express from "express";
import { saveRetirementAnalysis, getRetirementAnalysis, getUserRetirementAnalyses } from "../service/retirementController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveRetirementAnalysis);
router.get("/", protect, getRetirementAnalysis);
router.get("/history", protect, getUserRetirementAnalyses);

export default router;
