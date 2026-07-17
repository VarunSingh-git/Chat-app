import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token = null

    const authHeader = req.headers["authorization"]
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]
    }

    if (!token && req.cookies) {
        token = req.cookies
    }

    if (!token) return res.status(400).json({ message: "Token missing" })

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    if (!decode) return res.status(400).json({ message: "Error occur duruing token verification" })

    req.user = decode
    next()
})

export default authMiddleware