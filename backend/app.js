import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./src/routes/userRoutes.js";
import { connectToSocket } from "./src/controllers/socketManager.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = connectToSocket(httpServer);

app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    if (retries > 0) {
      console.log(`Retrying MongoDB connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error("Failed to connect to MongoDB after multiple attempts");
      process.exit(1);
    }
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
