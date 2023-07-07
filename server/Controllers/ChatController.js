import ChatModel from "../Models/chatModel.js";

export const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId],
    });
    
    try {
        const savedChat = await newChat.save();
        res.status(200).json(savedChat);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const userChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
}