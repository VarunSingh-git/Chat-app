import e from "express";
import { registerUser,login, logout, checkUserLoggedIn } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
const router = e.Router()

router.route("/").get(authMiddleware, checkUserLoggedIn)
router.route("/registration").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(logout)


export default router