import { io } from "../socket/index.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

const handleSendMessage = async (chatId, senderId, message ) => {
  if (!chatId || !senderId || !message) {
    return false
  }
  const messageCreated = await Message.create({
    chatId,
    senderId,
    message,
  });
console.log("messageCreated",messageCreated);

  if (!messageCreated._id) return false

  const chatUpdated = await Chat.findByIdAndUpdate(chatId, {
    $set: {
      lastMessage: messageCreated?._id,
    },
  });

  if (!chatUpdated)
    return false
  io.to(chatId).emit("receive_message", messageCreated);

  return messageCreated;
};

export { handleSendMessage };
