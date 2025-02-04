import express from "express";
import http from "http";
import { Server } from "socket.io";
import messageModel from "../models/messageModel.js";
import conversationModel from "../models/conversationModel.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});
export const getRecipientSocketId = (recipientId) => userSocketMap[recipientId];
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != "undefind") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markLastMessageAsSeen", async ({ userId, conversationId }) => {
    try {
      await messageModel.updateMany(
        { conversationId, seen: false },
        { $set: { seen: true } }
      );
      await conversationModel.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      io.to(getRecipientSocketId(userId)).emit("messagesSeen", {
        conversationId,
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("likeMessage", ({ messageId, userId }) => {
    io.to(getRecipientSocketId(userId)).emit("setLiked", {
      messageId,
    });
  });

  socket.on("typing", ({ conversationId, userId }) => {
    io.to(getRecipientSocketId(userId)).emit("showTyping", {
      conversationId,
    });
  });

  socket.on("notTyping", ({ conversationId, userId }) => {
    io.to(getRecipientSocketId(userId)).emit("hideTyping", {
      conversationId,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
  });
});

export { io, server, app };
