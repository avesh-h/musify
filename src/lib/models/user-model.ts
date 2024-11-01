import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  role: { type: String, enum: ["normal", "creator"] },
  userName: String,
  password: String,
  email: String,
  spaces: [{ type: mongoose.Types.ObjectId, ref: "Space" }],
});

const Users = models?.Users || model("Users", UserSchema);

export default Users;
