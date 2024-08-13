import express from "express";
import { test, updateUser, deleteUser, getUserListings, getUser, toggleWishlist, getWishlist } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js"; 
 
const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);

router.post("/wishlist/toggle", verifyToken, toggleWishlist);
router.get("/wishlist/:id", verifyToken, getWishlist);

export default router;

