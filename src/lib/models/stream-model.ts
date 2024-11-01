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

const Streams =
  mongoose.models?.Stream || mongoose.model("Stream", StreamModel);

export default Streams;
