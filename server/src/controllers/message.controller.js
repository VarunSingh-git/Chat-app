import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { createMessage } from "../services/message.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// used by socket/index.js on "send_message" event
const handleSendMessage = asyncHandler(async (io, chatId, senderId, message) => {
  const populatedData = await createMessage(io, chatId, senderId, message)
  if (!populatedData) return false

  io.to(chatId).emit("receive_message", populatedData);
  return populatedData;
})

const sendMessageController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const senderId = req.user?._id

  const populatedMessage = await createMessage(chatId, message, senderId)
  if (!populatedMessage) return res.status(400).json({ message: "Failed to send message" })

  return res.status(201).json(populatedMessage)
})

const getMessageController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 30 } = req.query;

  const messages = await Message.find({ chatId })
    .populate("senderId", "username")
    .sort({ createdAt: -1 }) // newest first
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(200).json(messages.reverse()); // reverse so oldest-to-newest for UI
})


export { handleSendMessage, sendMessageController, getMessageController };
