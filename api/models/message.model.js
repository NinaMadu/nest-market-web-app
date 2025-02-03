import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true, 
        },
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message", 
            default: null, 
          },
          read: {
            type: Boolean,
            default: false, 
        },
    },
    { timestamps: true } // createdAt and updatedAt are added automatically
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
