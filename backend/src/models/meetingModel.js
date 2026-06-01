import { Schema } from "mongoose";
import mongoose from "mongoose";
const meetingSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  meetingCode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
});

export default mongoose.model("Meeting", meetingSchema);
