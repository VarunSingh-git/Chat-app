import e from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { chat, getUserChats } from "../controllers/chat.controller.js";
import { sendMessageController, getMessageController } from "../controllers/message.controller.js";
const router = e.Router()

router.route("/create-chat-room").post(authMiddleware, chat)
router.route("/chats/:chatId/messages")
    .post(authMiddleware, sendMessageController)
    .get(authMiddleware, getMessageController)
router.route("/").get(authMiddleware, getUserChats); 


export default router