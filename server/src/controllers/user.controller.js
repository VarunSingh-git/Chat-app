import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const isUserExists = await User.findOne({ email })
    if (isUserExists) return res.status(400).json({ message: "User already registred" })

    if (!password) return res.status(400).json({ message: "Password is required" })
    if (!username) return res.status(400).json({ message: "username is required" })

    const user = await User.create({
        username,
        email,
        password
    })

    if (!user?._id) return res.status(500).json({ message: "User not register. try again" })

    return res.status(200).json({ message: "User registered successfully" })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email })
    if (!isUserExists) return res.status(404).json({ message: "User not found" })

    const isPasswordCorrect = await isUserExists.comparePassword(password)
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid passwrod" })

    const accessToken = isUserExists.generateAccessToken()
    const refreshToken = isUserExists.generateRefreshToken()

    isUserExists.refreshToken = refreshToken
    await isUserExists.save()

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                message: "User login successfully",
                success: true,
                accessToken: accessToken
            }
        )


})

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies
    if (req.user) req.user = null

    console.log("req.cookies.refreshToken", req.cookies.refreshToken);
    console.log("req.cookies", req.cookies);

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token is required",
        });
    }

    const user = await User.findOne({ refreshToken })

    if (!user) return res.status(400).json({
        message: "User not found",
    })

    user.refreshToken = ""
    await user.save()

    return res.status(200).json({
        message: "Logout success"
    })
})

const checkUserLoggedIn = asyncHandler(async (req, res) => {
    if (req.user?._id) { return res.status(200).json({ message: "User still login" }) }
})
export { registerUser, login, logout, checkUserLoggedIn }