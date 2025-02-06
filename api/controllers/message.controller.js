import Message from "../models/message.model.js";

export const createMessage = async (req, res) => {
    const { message, sender, receiver, itemId } = req.body;

    if (!message || !sender || !receiver || !itemId) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Sort sender and receiver to ensure a consistent conversation ID
        const sortedUsers = [sender, receiver].sort();
        const conversationId = `${sortedUsers[0]}_${sortedUsers[1]}_${itemId}`;

        const newMessage = new Message({
            conversationId,
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

export const getMessagesForReceiver = async (req, res) => {
    const { userId } = req.params; // Match route parameter name

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const messages = await Message.find({ receiver: userId }).sort({ createdAt: -1 });

        if (!messages.length) {
            return res.status(404).json({ message: "No messages found for this user." });
        }

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getMessagesForSender = async (req, res) => {
    const { userId } = req.params; // Match route parameter name

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        // Find messages where the user is the sender
        const messages = await Message.find({ sender: userId }).sort({ createdAt: -1 });

        if (!messages.length) {
            return res.status(404).json({ message: "No messages found for this sender." });
        }

        res.status(200).json({ messages });
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

export const replyMessage = async (req, res) => {
    const { id } = req.params; // Original message ID
    const { message, sender, receiver, itemId } = req.body;
  
    try {
        // Find the original message to reply to
        const originalMessage = await Message.findById(id);
        if (!originalMessage) {
            return res.status(404).json({ error: "Original message not found." });
        }

        // Use the same conversationId as the original message
        const newMessage = new Message({
            conversationId: originalMessage.conversationId,
            message,
            sender,
            receiver,
            itemId,
            replyTo: id, // Reference to the original message
        });

        await newMessage.save();
  
        res.status(201).json({
            message: "Reply sent successfully.",
            data: newMessage,
        });
    } catch (error) {
        console.error("Error sending reply:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getMessagesByConversation = async (req, res) => {
    const { conversationId } = req.params; // Get conversationId from URL

    if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required." });
    }

    try {
        // Fetch messages using the provided conversationId
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        if (!messages.length) {
            return res.status(404).json({ message: "No messages found in this conversation." });
        }

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};


export const markMessageAsRead = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findByIdAndUpdate(
            messageId,
            { read: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }

        res.status(200).json({ message: "Message marked as read.", data: message });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const getConversationsByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        // Find messages where the user is part of the conversationId
        const messages = await Message.find({
            conversationId: { $regex: new RegExp(`^${userId}_|_${userId}_|_${userId}$`) }
        })
        .sort({ createdAt: -1 })
        .populate("sender", "username avatar")
        .populate("receiver", "username avatar")
        .populate("itemId", "title");

        if (!messages.length) {
            return res.status(404).json({ message: "No conversations found for this user." });
        }

        // Group messages by conversationId and keep only the latest message for each
        const conversations = {};
        messages.forEach((msg) => {
            const { conversationId } = msg;
            if (!conversations[conversationId]) {
                conversations[conversationId] = {
                    conversationId,
                    item: msg.itemId,
                    participants: [msg.sender, msg.receiver],
                    lastMessage: msg,
                };
            }
        });

        res.status(200).json({ conversations: Object.values(conversations) });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};


