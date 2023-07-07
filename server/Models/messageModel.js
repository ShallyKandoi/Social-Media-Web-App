import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;