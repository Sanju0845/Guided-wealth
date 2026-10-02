import express from "express";
import { getAllAssessments, getAllRetirementAnalyses } from "../service/adminController.js";
import { protect, admin } from "./authMiddleware.js";

const router = express.Router();

router.get("/assessments", protect, admin, getAllAssessments);
router.get("/retirement-analysis", protect, admin, getAllRetirementAnalyses);

export default router;
