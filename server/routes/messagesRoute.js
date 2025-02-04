import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getConversations,
  getMessages,
  likeMessage,
  sendMessage,
} from "../controllers/messagesControllers.js";

let router = express.Router();
router
  .route("/")
  .post(verifyToken, sendMessage)
  .get(verifyToken, getConversations)
  .put(verifyToken, likeMessage);
router.get("/:messangerId", verifyToken, getMessages);
export default router;
