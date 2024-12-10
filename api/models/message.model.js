import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true } // createdAt and updatedAt are added automatically
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
