import express from "express";
import { createRoom } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE ROOM
router.post("/create", verifyToken, createRoom);

export default router;