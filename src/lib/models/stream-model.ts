import mongoose from "mongoose";

const StreamModel = new mongoose.Schema({
  audios: [
    {
      url: String,
      upvotes: [{ type: mongoose.Types.ObjectId, ref: "Users", unique: true }],
    },
  ],
  spaceId: { type: mongoose.Types.ObjectId, ref: "Space" },
  active: { type: Boolean, enum: [true, false] },
});

// Set `audios` to be an empty array by default
StreamModel.path("audios").default([]);

StreamModel.path("active").default(false);

const Streams =
  mongoose.models?.Stream || mongoose.model("Stream", StreamModel);

export default Streams;
