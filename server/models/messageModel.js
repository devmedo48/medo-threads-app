import { model, Schema } from "mongoose";

let messageSchema = Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "conversations" },
    sender: { type: Number, ref: "users" },
    text: String,
    img: String,
    isLiked: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("messages", messageSchema);
