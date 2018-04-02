import mongoose from "mongoose";

export type TimeLogModel = mongoose.Document & {
  id: string,
  description: string,
  startTime: Date,
  endTime: Date,
  projectId: string,
  timeElapsed: number
};

const timeLogSchema = new mongoose.Schema({
  // _id: { type: String, alias: "id" },
  description: String,
  startTime: Date,
  endTime: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  timeElapsed: Number
}, { timestamps: true });

const TimeLog = mongoose.model("TimeLog", timeLogSchema);
export default TimeLog;