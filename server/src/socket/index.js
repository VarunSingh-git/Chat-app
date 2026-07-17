import http from "node:http";
import { Server } from "socket.io";
import { asyncHandler } from "../utils/asyncHandler";

export const server = http.createServer();
export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

export const initSocket = () => {

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send_message", asyncHandler(async ({ chatId, senderId, message }) => {
      // call your controller logic here, not raw DB code
      await handleSendMessage(chatId, senderId, message);
    }))

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};