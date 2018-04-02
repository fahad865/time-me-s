import mongoose from "mongoose";

export type ProjectModel = mongoose.Document & {
  id: string,
  name: string,
  hourlyRate: number,
  currency: string,
};

const projectSchema = new mongoose.Schema({
  // _id: { type: String, alias: "id" },
  name: String,
  hourlyRate: Number,
  currency: String,
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;