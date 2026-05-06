import express from "express";
import { createRoom,getMyRooms } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getRoomById } from "../controllers/roomController.js";
const roomRouter = express.Router();

// CREATE ROOM
roomRouter.post("/create", verifyToken, createRoom);
//Get my rooms
roomRouter.get("/my-rooms", verifyToken, getMyRooms);
//Get room by id
roomRouter.get("/:roomId", verifyToken, getRoomById);

export default roomRouter;