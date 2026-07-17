import { io } from "../socket/index.js";
import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";

const handleSendMessage = async ({ chatId, senderId, message }) => {

    if (!chatId || !senderId || !message) {
        return res.status(400).json({ message: "ChatId, senderId and message is required" })
    }
    const messageCreated = await Message.create({
        chatId,
        senderId,
        message
    })

    if (!messageCreated._id) return res.status(500).json({ message: "Message couldn't create" })

    const chatUpdated = await Chat.findByIdAndUpdate(chatId, {
        $set: {
            lastMessage: message
        }
    })

    if (!chatUpdated) return res.status(400).json({ message: "last message is not update. try again" })
    io.to(chatId).emit("receive_message", messageCreated)

    return messageCreated
}

export { handleSendMessage }