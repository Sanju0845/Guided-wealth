import express from "express";
import { subscribe, sendNewsletter } from "../service/newsletterController.js";

const router = express.Router();

// Public: footer subscribe box
router.post("/subscribe", subscribe);

// Cron-protected: weekly dispatch (GET so Vercel Cron can hit it; POST also allowed for manual)
router.get("/send", sendNewsletter);
router.post("/send", sendNewsletter);

export default router;
