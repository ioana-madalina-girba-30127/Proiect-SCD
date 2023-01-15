import mongoose from "mongoose";

const positionsSchema = new mongoose.Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  createTime: { type: Date, default: Date.now() },
});

export default mongoose.model("Position", positionsSchema);
