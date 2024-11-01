import mongoose from "mongoose";

const SpaceModel = new mongoose.Schema({
  spaceName: { type: String },
  creator: { type: mongoose.Types.ObjectId, ref: "Users" },
  streams: [{ type: mongoose.Types.ObjectId, ref: "Stream" }],
});

// Set `streams` to be an empty array by default
SpaceModel.path("streams").default([]);

const Spaces = mongoose.models?.Space || mongoose.model("Space", SpaceModel);

export default Spaces;
