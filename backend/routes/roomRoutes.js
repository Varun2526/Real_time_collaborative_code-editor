import express from "express";
import { createRoom } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getRoomById } from "../controllers/roomController.js";
const roomRouter = express.Router();

// CREATE ROOM
roomRouter.post("/create", verifyToken, createRoom);
//Get room by id
roomRouter.get("/:roomId", verifyToken, getRoomById);
export default roomRouter;