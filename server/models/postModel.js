import { model, Schema } from "mongoose";

let postSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    postedBy: {
      type: Number,
      ref: "users",
      required: true,
    },
    text: { type: String, maxLength: 500 },
    imgs: { type: [String], default: [] },
    likes: { type: [Number], ref: "users", default: [] },
    replies: [
      {
        userId: {
          type: Number,
          ref: "users",
          required: true,
        },
        text: { type: String, maxLength: 200, required: true },
        userProfilePic: String,
        name: String,
        username: String,
        createdAt: Number,
        likes: {
          type: Array,
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("posts", postSchema);
