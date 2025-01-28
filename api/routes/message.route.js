import express from "express";
import {
    createMessage,
    deleteMessage,
    getMessagesForReceiver,
    getMessageById,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.delete("/:id", deleteMessage);
router.get("/receiver/:userId", getMessagesForReceiver);
router.get("/:id", getMessageById);

export default router;
