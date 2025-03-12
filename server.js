import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Load Environment Variables
dotenv.config();

// Validate Required ENV Variables
const requiredEnvVars = ["MONGO_URI", "PORT"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(` Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();

// Define Allowed Origins
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://frontend-dashboard-omega.vercel.app", // Deployed frontend
];

// Middleware
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(cookieParser());

// Debugging: Show environment variables in development only
if (process.env.NODE_ENV !== "production") {
  console.log(" Loaded Environment Variables:", {
    MONGO_URI: process.env.MONGO_URI ? ";-) Set" : ":-( Not Set",
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  });
}

// MongoDB Connection with Retry Logic
const connectDB = async (attempts = 5) => {
  console.log("<><> Connecting to MongoDB...");
  for (let i = 0; i < attempts; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`Yepp! MongoDB Connected: ${mongoose.connection.host}`);

      mongoose.connection.on("error", (err) => {
        console.error(" MongoDB Error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn(" MongoDB Disconnected! Reconnecting...");
        connectDB();
      });

      return;
    } catch (err) {
      console.error(` MongoDB Connection Failed (Attempt ${i + 1}/${attempts}):`, err);
      if (i < attempts - 1) {
        console.log("<><> Retrying in 5 seconds...");
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        process.exit(1);
      }
    }
  }
};
connectDB();

// Routes
import authRoutes from "./routes/auth.js";
import sheetRoutes from "./routes/sheets.js";

app.use("/api/auth", authRoutes);
app.use("/api/sheets", sheetRoutes);

// Root Test Route
app.get("/", (req, res) => res.send(" Server is Running!"));

// Graceful Shutdown Handling
const shutdown = async () => {
  console.log("\n Shutting down...");
  await mongoose.connection.close();
  console.log(" MongoDB Disconnected. Exiting...");
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
