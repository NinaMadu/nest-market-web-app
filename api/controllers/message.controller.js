import Message from "../models/message.model.js";

export const createMessage = async (req, res) => {
    const { message, sender, receiver, itemId } = req.body;

    
    if (!message || !sender || !receiver || !itemId) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const newMessage = new Message({
            message,
            sender,
            receiver,
            itemId,
        });

        await newMessage.save();
        res.status(201).json({ message: "Message created successfully.", data: newMessage });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }

        res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getMessagesForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.find({ receiver: userId })
            .populate("sender", "username avatar")
            .populate("itemId", "title");

        res.status(200).json({ message: "Messages fetched successfully.", data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getMessageById = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findById(id)
            .populate("sender", "username avatar")
            .populate("receiver", "username avatar")
            .populate("itemId", "title");

        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }

        res.status(200).json({ message: "Message fetched successfully.", data: message });
    } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
