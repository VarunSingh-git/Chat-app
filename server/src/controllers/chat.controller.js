import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const chat = asyncHandler(async (req, res) => {
    const { invitedUserId } = req.body;
    const isInvitedUserExists = await User.findById(invitedUserId)
    if (!isInvitedUserExists?._id) return res.status(400).json({ message: "Invited user not exists" })

    const isChatExits = await Chat.findOne({
        isGroup: false,
        participants: {
            $all: [req.user?._id, isInvitedUserExists?._id], $size: 2
        }
    })

    if (isChatExits) return res.status(200).json({ message: "Chat is already exits", isChatExits })

    const chat = await Chat.create({
        participants: [req.user?._id, isInvitedUserExists?._id],
        isGroup: false,
    })
    if (!chat) return res.status(500).json({ message: "chat not created. try again" })

    return res.status(200).json({ message: "Chat created successfully", chat })
})

export { chat }