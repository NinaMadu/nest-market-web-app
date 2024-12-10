import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
    res.send("Test route");
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your account !"));
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        )

        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your account"));

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('acces_token')
        res.status(200).json("User has been deleted...")
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);

        } catch (error) {
            next(error)
        }
    }
    else {
        return next(errorHandler(401, "You cannot veiw that listings!"));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return next(errorHandler(404, "User not found"));
        const { password: pass, ...rest } = user._doc
        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}

export const toggleWishlist = async (req, res, next) => {
    const { itemId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    try {
        const user = await User.findById(userId);
        const itemIndex = user.wishlist.indexOf(itemId);

        if (itemIndex > -1) {
            // Item already in wishlist, remove it
            user.wishlist.splice(itemIndex, 1);
        } else {
            // Item not in wishlist, add it
            user.wishlist.push(itemId);
        }

        await user.save();
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;

        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, "You cannot view this wishlist!"));
        }

        const user = await User.findById(userId).populate("wishlist");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        next(error);
    }
};

export const getUserMessageIds = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID and populate only the `messages` field
        const user = await User.findById(id).select("messages");

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return the list of message IDs
        res.status(200).json({
            message: "Message IDs retrieved successfully.",
            data: user.messages,
        });
    } catch (error) {
        console.error("Error retrieving user messages:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};