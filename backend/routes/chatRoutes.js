import express from "express";
import {getMessages} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const chatRouter=express.Router();

// Get messages by room id
chatRouter.get("/:roomId", verifyToken, getMessages);

export default chatRouter;