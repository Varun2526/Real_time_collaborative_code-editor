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

export const getRoomById = async (req, res) => {
  try {

    // 1. get roomId from params
    const { roomId } = req.params;

    // 2. find room
    const room = await Room.findOne({ roomId })
      .populate("owner", "username email profilePic");

    // 3. room not found
    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    // 4. response
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

/*Eg:
roomId: "1234abcd"(link endpoint)

room gets fetched
{
  "message": "Room fetched successfully",
  "payload": {
    "_id": "69fac9a6a3d5851e05021648",
    "roomId": "b6f791fd-8c46-49cb-9eee-ff0ebec60965",
    "code": "",
    "language": "javascript",
    "owner": {
      "_id": "69f9ab814a96d1fbed608c12",
      "username": "Varun",
      "email": "hareesh@mail.com",
      "profilePic": null
    },
    "createdAt": "2026-05-06T04:55:02.376Z",
    "updatedAt": "2026-05-06T04:55:02.376Z"
  }
}
*/


export const getMyRooms = async (req, res) => {
    try {
        // Get user ID from the request (set by verifyToken middleware)
        const userId = req.user.id;
        // Find all rooms where the owner is the current user, sorted by creation date (newest first)
        const rooms = await Room.find({ owner: userId }).sort({ createdAt: -1 });
        //return the list of rooms in the response
        res.status(200).json({message:"Rooms fetched successfully",payload :  rooms});
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Server error' });
    }