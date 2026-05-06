import express from "express";
import { createRoom } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getRoomById } from "../controllers/roomController.js";
const router = express.Router();

// CREATE ROOM
router.post("/create", verifyToken, createRoom);
//Get room by id
router.get("/:roomId", verifyToken, getRoomById);
export default router;