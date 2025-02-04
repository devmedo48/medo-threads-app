import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import appError from "../utils/appError.js";
import handleError from "../utils/handleError.js";
import { v2 as cloudinary } from "cloudinary";

export let sendMessage = handleError(async (req, res) => {
  let { recipientId, text, img, userId: senderId } = req.body;
  let conversation = await conversationModel.findOne({
    participants: { $all: [senderId, recipientId] },
  });

  if (!conversation) {
    conversation = await conversationModel.create({
      participants: [senderId, recipientId],
      lastMessage: {
        text: text || "image...",
        sender: senderId,
      },
    });
  }
  if (img) {
    let { secure_url } = await cloudinary.uploader.upload(img);
    img = secure_url;
  }
  const newMessage = new messageModel({
    conversationId: conversation._id,
    sender: senderId,
    text,
    img,
  });
  await Promise.all([
    newMessage.save(),
    conversation.updateOne({
      lastMessage: {
        text: text || "image...",
        sender: senderId,
      },
    }),
  ]);
  const recipientSocketId = getRecipientSocketId(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newMessage", newMessage);
  }
  res.status(201).json({
    success: true,
    message: "message created successfully",
    newMessage,
  });
});

export let getMessages = handleError(async (req, res, next) => {
  let { userId } = req.body;
  let messangerId = +req.params.messangerId;
  let conversation = await conversationModel.findOne({
    participants: { $all: [userId, messangerId] },
  });
  if (!conversation) return next(new appError("No messages yet", 404));
  let messages = await messageModel
    .find({ conversationId: conversation._id })
    .sort({ createdAt: -1 });
  res.json({
    success: true,
    messages,
  });
});

export let getConversations = handleError(async (req, res, next) => {
  let { userId } = req.body;
  let conversations = await conversationModel.find({
    participants: userId,
  });
  if (!conversations || conversations.length < 1)
    return next(new appError("No coversations yet", 404));
  res.json({
    success: true,
    conversations,
  });
});

export let likeMessage = handleError(async (req, res, next) => {
  let { messageId } = req.body;
  let message = await messageModel.findById(messageId);
  if (!message) return next(new appError("Message not found", 404));
  message.isLiked = !message.isLiked;
  await message.save();
  res.json({
    success: true,
    message: "message has been liked successfully",
  });
});
