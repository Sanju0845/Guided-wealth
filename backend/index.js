import "dotenv/config.js";
import express from "express";
import cors from "cors";
import connectDB from "./service/db.js";
import authRoutes from "./auth/authRoutes.js";
import userRoutes from "./auth/userRoutes.js";
import assessmentRoutes from "./auth/assessmentRoutes.js";
import retirementRoutes from "./auth/retirementRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Define basic route
app.get('/', (req, res) => {
    res.send('Express is running successfully!');
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/retirement-analysis", retirementRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
