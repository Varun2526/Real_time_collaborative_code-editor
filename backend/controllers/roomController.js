import { v4 as uuidv4 } from "uuid";
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {

    // 1. get logged-in user
    const userId = req.user.userId;

    // 2. generate room id
    const roomId = uuidv4();

    // 3. create room
    const room = await Room.create({
      roomId,
      members: [{
    user: userId,
    role: "owner"
  }]
    });

    // 4. response
    res.status(201).json({
      message: "Room created successfully",
      payload: room
    });

  } catch (error) {
    console.log("Error creating room:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


/*
    example 
    if  User logs in once
         userId = abc123
    
    User creates a room 1
            roomId = 1234abcd(Auto-generated using uuid)
    User creates a room 2
            roomId = 5678efgh
            
    The database will have entries like:
    Room {
    roomId: "1234abcd",
    owner: "abc123"
    }
    Room{
    roomId: "5678efgh",
    owner: "abc123"
    }
*/

export const getMyRooms = async (req, res) => {
    try {
        // Get user ID from the request (set by verifyToken middleware)
        const userId = req.user.userId;
        // Find all rooms where the owner is the current user, sorted by creation date (newest first)
         const rooms = await Room.find({"members.user": userId}).sort({ createdAt: -1 });
        //return the list of rooms in the response
        res.status(200).json({message:"Rooms fetched successfully",payload :  rooms});
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRoomById = async (req, res) => {
  try {

    // 1. get roomId from params
    const { roomId } = req.params;
    // 2. find room
    const room = await Room.findOne({ roomId })
      .populate("members.user", "username email profilePic");
    // 3. room not found
    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }
    // 4. check if current user is a member
   const isMember = room.members.some(member =>
  member.user._id? member.user._id.toString() === req.user.userId: member.user.toString() === req.user.userId);
    // 5. deny access if not member
    if (!isMember) {
      return res.status(403).json({
        message: "Access denied"
      });
    }
    // 6. response
    res.status(200).json({
      message: "Room fetched successfully",
      payload: room
    });
  } catch (error) {
    console.log("Error fetching room:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};