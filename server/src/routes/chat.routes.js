import e from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { chat } from "../controllers/chat.controller.js";
const router = e.Router()

router.route("/create-chat-room").post(authMiddleware, chat)



export default router