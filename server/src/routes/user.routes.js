import e from "express";
import { registerUser,login, logout, checkUserLoggedIn, getUserById } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
const router = e.Router()

router.route("/registration").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/getUserById").get(authMiddleware, getUserById)



export default router