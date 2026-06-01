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

app.use(cors({ origin: "http://localhost:5173" , credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
