import "dotenv/config.js";
import express from "express";
import cors from "cors";
import connectDB from "./service/db.js";
import authRoutes from "./auth/authRoutes.js";
import userRoutes from "./auth/userRoutes.js";
import assessmentRoutes from "./auth/assessmentRoutes.js";
import retirementRoutes from "./auth/retirementRoutes.js";
import adminRoutes from "./auth/adminRoutes.js";

// MongoDB Connection is handled via middleware


const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://www.guidedwealthy.in",
    "https://guidedwealthy.in",
    "https://guided-wealth-hewy.vercel.app",
    process.env.FRONTEND_URL,
    process.env.ADMIN_FRONTEND_URL
].filter(Boolean);

// Manual CORS Middleware for Vercel Serverless compatibility
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Always reflect the requested origin to avoid Vercel edge issues, 
    // or fallback to the explicit allowed URL
    res.header("Access-Control-Allow-Origin", origin || "https://guided-wealth-hewy.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Immediately respond to preflight requests with HTTP 200 OK
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    
    next();
});
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Define basic route and health check
app.get('/', (req, res) => {
    res.send('Express is running successfully!');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend is running perfectly!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Ensure DB is connected before processing any routes
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/retirement-analysis", retirementRoutes);
app.use("/api/admin", adminRoutes);

// Start the server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is live at http://localhost:${PORT}`);
    });
}

export default app;
