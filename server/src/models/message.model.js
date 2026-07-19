import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    message: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

export const Message = new model("Message", messageSchema)