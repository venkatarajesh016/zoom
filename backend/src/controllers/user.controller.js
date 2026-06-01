import User from "../models/userModel.js";
import Meeting from "../models/meetingModel.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import crypto from "crypto";

export const login = async (req, res) => {
  const {username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid username or password" });
    }
    user.token = crypto.randomBytes(64).toString("hex"); // In production, generate a secure token (e.g., JWT)
    await user.save();
    res.status(200).json({ message: "Login successful", user });
};


export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body || {};
    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // In production, use bcrypt to hash passwords
    const newUser = new User({ name, username, password: hashedPassword, token: "" });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const token = req.query.token;
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const meetings = await Meeting.find({ userId: user._id }).sort({ createdAt: -1 });
      res.status(200).json({ meetings });
    }
    catch(err){
      console.error("Error fetching user history:", err);
      res.status(500).json({ message: "Error fetching user history", error: err.message });
    }
};

export const addToUserHistory = async (req, res) => {
  try {
    const { token, meetingCode } = req.body;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newMeeting = new Meeting({ userId: user._id, meetingCode });
    await newMeeting.save();
    res.status(201).json({ message: "Meeting added to history", meeting: newMeeting });
  } catch (err) {
    console.error("Error adding to user history:", err);
    res.status(500).json({ message: "Error adding to user history", error: err.message });
  }
};
