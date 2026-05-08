import express from "express";
import { createRoom, getMyRooms, searchRooms } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getRoomById } from "../controllers/roomController.js";
import {requestJoinRoom,rejectJoinRequest} from "../controllers/roomController.js";
import {getPendingRequests,approveJoinRequest, promoteModerator, demoteModerator, transferOwnership, updateRoomSettings, deleteRoom, leaveRoom, removeMember}from "../controllers/roomController.js";
const roomRouter = express.Router();

// CREATE ROOM
roomRouter.post("/create", verifyToken, createRoom);

//Get my rooms
roomRouter.get("/my-rooms", verifyToken, getMyRooms);

//Search rooms
roomRouter.get("/search", verifyToken, searchRooms);

//Get room by id
roomRouter.get("/:roomId", verifyToken, getRoomById);
//request join room
roomRouter.post("/:roomId/request-join", verifyToken, requestJoinRoom);
//get pending requests
roomRouter.get("/:roomId/pending", verifyToken, getPendingRequests);
//approve join request
roomRouter.post("/:roomId/approve/:userId", verifyToken, approveJoinRequest);
//reject join request
roomRouter.post("/:roomId/reject/:userId", verifyToken, rejectJoinRequest);
//promote member to moderator
roomRouter.patch("/:roomId/promote/:userId", verifyToken, promoteModerator);
//demote moderator to member
roomRouter.patch("/:roomId/demote/:userId", verifyToken, demoteModerator);
//transfer ownership
roomRouter.patch("/:roomId/transfer-ownership/:userId", verifyToken, transferOwnership);
//update room settings
roomRouter.patch("/:roomId/settings", verifyToken, updateRoomSettings);
//delete room
roomRouter.delete("/:roomId", verifyToken, deleteRoom);

// Leave room
roomRouter.post("/:roomId/leave", verifyToken, leaveRoom);
// Remove member
roomRouter.post("/:roomId/remove/:userId", verifyToken, removeMember);

export default roomRouter;