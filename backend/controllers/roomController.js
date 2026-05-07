import { v4 as uuidv4 } from "uuid";
import Room from "../models/Room.js";

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {title,description,language,visibility} = req.body;
    const roomId = uuidv4();
    const room = await Room.create({roomId,title,description,language,visibility,
      members: [{user: userId, role: "owner"}]
    });
    return res.status(201).json({ message: "Room created successfully", payload: room });
  } catch (error) {
    console.log("Error creating room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// GLOBAL ROOM SEARCH
export const searchRooms = async (req, res) => {
  try {
    const q = req.query.q || "";
    const rooms = await Room.find({visibility: "public",$text: {$search: q}})
      .select(`
        roomId
        title
        description
        language
        visibility
        createdAt
      `)
      .sort({createdAt: -1});
    return res.status(200).json({ message: "Rooms fetched successfully", payload: rooms });
  } catch (error) {
    console.log("Search rooms error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// GET MY ROOMS
export const getMyRooms = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rooms = await Room.find({"members.user": userId}).sort({createdAt: -1 });
    return res.status(200).json({ message: "Rooms fetched successfully", payload: rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// GET ROOM BY ROOM ID
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId })
      .populate(
        "members.user",
        "username email profilePic"
      );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isMember = room.members.some(member =>
      member.user._id? member.user._id.toString() === req.user.userId: member.user.toString() === req.user.userId );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json({ message: "Room fetched successfully", payload: room });
  } catch (error) {
    console.log("Error fetching room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// REQUEST JOIN ROOM
export const requestJoinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isAlreadyMember = room.members.some( member => member.user.toString() === userId);
    if (isAlreadyMember) {
      return res.status(400).json({ message: "You are already a member" });
    }
    const isAlreadyPending = room.pendingRequests.some(pendingUserId =>pendingUserId.toString() === userId);
    if (isAlreadyPending) {
      return res.status(400).json({ message: "Join request already pending" });
    }
    if (room.members.length >= room.settings.maxUsers) {
      return res.status(400).json({ message: "Room is full" });
    }

    // PUBLIC ROOM => DIRECT JOIN
    if (room.visibility === "public") {
      room.members.push({
        user: userId,
        role: "member"
      });
      await room.save();
      return res.status(200).json({ message: "Joined room successfully", payload: room });
    }

    // PRIVATE ROOM => REQUEST JOIN
    room.pendingRequests.push(userId);
    await room.save();
    return res.status(200).json({ message: "Join request sent successfully" });
  } catch (error) {
    console.log("Error requesting join:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// GET PENDING REQUESTS
export const getPendingRequests = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    const room = await Room.findOne({ roomId })
      .populate(
        "pendingRequests",
        "username email profilePic"
      );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isModerator = room.members.some(member=> member.user.toString() === userId && (member.role === "owner" ||member.role === "moderator" ));
    if (!isModerator) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json({ message: "Pending requests fetched successfully", payload: room.pendingRequests });
  } catch (error) {
    console.log("Error fetching pending requests:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// APPROVE JOIN REQUEST
export const approveJoinRequest = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isModerator = room.members.some(member =>member.user.toString() === currentUserId &&(member.role === "owner" ||member.role === "moderator"));
    if (!isModerator) {
      return res.status(403).json({ message: "Access denied" });
    }
    const isPending = room.pendingRequests.some(pendingUserId =>pendingUserId.toString() === userId);
    if (!isPending) {
      return res.status(400).json({ message: "No pending request found" });
    }
    if (room.members.length >= room.settings.maxUsers) {
      return res.status(400).json({ message: "Room is full" });
    }
    room.pendingRequests =room.pendingRequests.filter(pendingUserId =>pendingUserId.toString() !== userId);
    room.members.push({
      user: userId,
      role: "member"
    });
    await room.save();
    return res.status(200).json({ message: "Join request approved successfully" });
  } catch (error) {
    console.log("Error approving request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// REJECT JOIN REQUEST
export const rejectJoinRequest = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isModerator = room.members.some(member =>member.user.toString() === currentUserId &&(member.role === "owner" ||member.role === "moderator"));
    if (!isModerator) {
      return res.status(403).json({ message: "Access denied" });
    }
    room.pendingRequests =room.pendingRequests.filter(pendingUserId =>pendingUserId.toString() !== userId);
    await room.save();
    return res.status(200).json({ message: "Join request rejected successfully" });
  } catch (error) {
    console.log("Error rejecting request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};