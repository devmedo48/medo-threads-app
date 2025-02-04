import { model, Schema } from "mongoose";

const conversationSchema = Schema(
  {
    participants: [{ type: Number, ref: "users" }],
    lastMessage: {
      text: String,
      sender: { type: Number, ref: "users" },
      seen: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default model("conversations", conversationSchema);
