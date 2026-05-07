import Room from "../models/Room.js";
import { MessageModel } from "../models/Message.js";

// Get messages based on room id
export const getMessages = async (req, res) => {
  
    try {
    // get public roomId
    const { roomId } = req.params;
    // validate roomId exists
    if (!roomId) {
      return res.status(400).json({message: "Room id is required"});
    }

    // find room using public UUID
    const room = await Room.findOne({ roomId });

    // room not found
    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }
    // check if current user is member
    const isMember = room.members.some(member =>member.user.toString() === req.user.userId);
    // deny access
    if (!isMember) {
      return res.status(403).json({message: "Access denied"});
    }

    // fetch messages using internal Mongo room _id
    const messages = await MessageModel.find({roomId: room._id })
      .populate("sender","username email profilePic").sort({ createdAt: 1 });

    // no messages found
    if (!messages || messages.length === 0) {
      return res.status(200).json({message: "No messages found",payload: []});
    }
    // response
    res.status(200).json({message: "Messages fetched successfully",payload: messages});
  } 
  
  catch (error) {
    console.log("Error fetching messages:", error);
    res.status(500).json({message: "Server error"});
  }
};
