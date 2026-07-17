import mongoose, { model, Schema } from "mongoose";

const chatSchema = new Schema({
    participants:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    isGroup: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
},
    {
        timestamps: true
    })

export const Chat = new model("Chat", chatSchema)