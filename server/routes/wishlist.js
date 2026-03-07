import express from "express";
import wishlistController from "../controllers/wishlist.js";
import validateInput from "../middlewares/requestValidationMiddleware.js";
import { replaceWishlistSchema } from "../utils/validation.js";
import { getAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(getAuthMiddleware());

router.get("/", wishlistController.getWishlist);
router.put("/", validateInput(replaceWishlistSchema), wishlistController.replaceWishlist);

export default router;
