import http from "node:http";
import { Server } from "socket.io";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleSendMessage } from "../controllers/message.controller.js";

export const server = http.createServer();
export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

export const initSocket = () => {

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send_message", asyncHandler(async ({ chatId, senderId, message }) => {
      // call your controller logic here, not raw DB code
      console.log("chatId, senderId, message",chatId, senderId, message);
      
      await handleSendMessage(chatId, senderId, message);
    }))

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};