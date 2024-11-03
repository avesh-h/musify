import mongoose from "mongoose";

const StreamModel = new mongoose.Schema({
  url: String,
  upvotes: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    default: [],
  },
  image: String,
  title: String,
  spaceId: { type: mongoose.Types.ObjectId, ref: "Space" },
});

const Streams =
  mongoose.models?.Stream || mongoose.model("Stream", StreamModel);

export default Streams;
