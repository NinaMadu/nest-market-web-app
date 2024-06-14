import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    negligible: {
        type: Boolean,
        required: true,
    },

    type: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true,
    },

    contactNo: {
        type: String,
        required: true,
    },
    imageUrls: {
        type: Array,
        required: true,
    },
    userRef: {
        type: String,
        required: true,
    },

}, { timestamps: true }

)

const Listing = mongoose.model("Listing", listingSchema);

export default Listing; 