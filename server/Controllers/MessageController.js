import MessageModel from "../Models/messageModel.js";

export const addMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;
    const newMessage = new MessageModel({
        chatId,
        senderId,
        message,
        });

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await MessageModel.find({ chatId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}

