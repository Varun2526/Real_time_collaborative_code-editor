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
      owner: userId
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
            roomId = 1234abcd
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