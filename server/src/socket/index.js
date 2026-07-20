import http from "node:http";
import { Server } from "socket.io";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleSendMessage } from "../controllers/message.controller.js";
import jwt from "jsonwebtoken"

export const server = http.createServer();
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, credentials: true
  }
});

export const initSocket = () => {

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error("No token provided"));

    try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
      socket.userId = decode._id
      next()
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  })


  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId)
    })

    socket.on("send_message", asyncHandler(async ({ chatId, senderId, message }) => {
      // call your controller logic here, not raw DB code      
      const result = await handleSendMessage(io, chatId, senderId, message);
      if (!result) socket.emit("error_message", "Failed to send message")
    }))

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};