import express from "express";
import {
    createMessage,
    deleteMessage,
    getMessagesForReceiver,
    getMessagesForSender,
    getMessageById,
    replyMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.delete("/:id", deleteMessage);
router.get("/receiver/:userId", getMessagesForReceiver);
router.get("/sender/:userId", getMessagesForSender);
router.get("/:id", getMessageById);
router.post("/:id/reply", replyMessage);

export default router;
