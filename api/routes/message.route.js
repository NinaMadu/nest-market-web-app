import express from "express";
import {
    createMessage,
    deleteMessage,
    getMessagesForReceiver,
    getMessagesForSender,
    getMessageById,
    replyMessage,
    markMessageAsRead,
    getMessagesByConversation,
    getConversationsByUserId,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.delete("/:id", deleteMessage);
router.get("/receiver/:userId", getMessagesForReceiver);
router.get("/sender/:userId", getMessagesForSender);
router.get("/:id", getMessageById);
router.post("/:id/reply", replyMessage);
router.put("/:id/read", markMessageAsRead);
router.get("/conversation/:conversationId", getMessagesByConversation);
router.get("/user/:userId", getConversationsByUserId);

export default router;
