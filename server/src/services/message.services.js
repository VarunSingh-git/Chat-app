import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createMessage = asyncHandler(async (chatId, senderId, message) => {
    if (!chatId || !senderId || !message)  return null
    
    const createdMessage = await Message.create({
        chatId,
        senderId,
        message
    })

    const populatedData = await Chat.findByIdAndUpdate(chatId, {
        $set: {
            lastMessage: createdMessage?._id
        }
    })
    if (!populatedData) return null;

    return populatedData
})

export { createMessage }