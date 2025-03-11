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

//  Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:3000", // Supports multiple origins
  })
);
app.use(express.json());
app.use(cookieParser());

//  Debugging: Show environment variables in development only
if (process.env.NODE_ENV !== "production") {
  console.log(" Loaded Environment Variables:", {
    MONGO_URI: process.env.MONGO_URI ? ";-) Set" : ":-( Not Set",
    PORT: process.env.PORT,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    NODE_ENV: process.env.NODE_ENV,
  });
}

//  MongoDB Connection with Retry Logic
const connectDB = async (attempts = 5) => {
  console.log("<><> Connecting to MongoDB...");
  for (let i = 0; i < attempts; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI); //  Removed deprecated options
      console.log(`Yepp! MongoDB Connected: ${mongoose.connection.host}`);

      mongoose.connection.on("error", (err) => {
        console.error(" MongoDB Error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn(" MongoDB Disconnected! Reconnecting...");
        connectDB(); // Auto-reconnect if disconnected
      });

      return; // Exit loop on success
    } catch (err) {
      console.error(` MongoDB Connection Failed (Attempt ${i + 1}/${attempts}):`, err);
      if (i < attempts - 1) {
        console.log("<><> Retrying in 5 seconds...");
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        process.exit(1); // Exit after max retries
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

//  Root Test Route
app.get("/", (req, res) => res.send(" Server is Running!"));

//  Graceful Shutdown Handling
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
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
