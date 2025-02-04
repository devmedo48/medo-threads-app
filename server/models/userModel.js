import { model, Schema } from "mongoose";

let userSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    profilePic: {
      type: String,
      default: "",
    },
    followers: { type: [Number], default: [] },
    following: { type: [Number], default: [] },
    bio: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default model("users", userSchema);
