import express from "express";
import { createRoom,getMyRooms } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getRoomById } from "../controllers/roomController.js";
import {requestJoinRoom,rejectJoinRequest} from "../controllers/roomController.js";
import {getPendingRequests,approveJoinRequest}from "../controllers/roomController.js";
const roomRouter = express.Router();

// CREATE ROOM
roomRouter.post("/create", verifyToken, createRoom);

//Get my rooms
roomRouter.get("/my-rooms", verifyToken, getMyRooms);

//Get room by id
roomRouter.get("/:roomId", verifyToken, getRoomById);
//request join room
roomRouter.post("/:roomId/request-join", verifyToken, requestJoinRoom);
//reject join request
roomRouter.post("/:roomId/reject-request/:userId", verifyToken, rejectJoinRequest);
//get pending requests
roomRouter.get("/:roomId/pending", verifyToken, getPendingRequests);
//approve join request
roomRouter.post("/:roomId/approve/:userId", verifyToken, approveJoinRequest);
//reject join request
roomRouter.post("/:roomId/reject/:userId", verifyToken, rejectJoinRequest);

export default roomRouter;