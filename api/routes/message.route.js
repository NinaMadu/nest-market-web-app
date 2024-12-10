import express from "express";
import {
    createMessage,
    deleteMessage,
    getMessagesForUser,
    getMessageById,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.delete("/:id", deleteMessage);
router.get("/receiver/:userId", getMessagesForUser);
router.get("/:id", getMessageById);

export default router;
