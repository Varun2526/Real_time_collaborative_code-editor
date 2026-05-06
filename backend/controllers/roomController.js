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
 
/*
EXAMPLE:
GET /api/rooms/my-rooms

SUCCESS RESPONSE:
{
  "message": "Rooms fetched successfully",
  "payload": []
}
*/



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
      return res.status(403).json({message: "Access denied"});
    }
    // 6. response
    res.status(200).json({message: "Room fetched successfully",payload: room});
  } catch (error) {
    console.log("Error fetching room:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/*GET /api/rooms/abcd1234

SUCCESS RESPONSE:
{
  "message": "Room fetched successfully",
  "payload": {}
}
 */


// REQUEST JOIN ROOM
export const requestJoinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    // 1. Find room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }
    // 2. Check already member
    const isAlreadyMember = room.members.some(member => member.user.toString() === userId);
    if (isAlreadyMember) {
      return res.status(400).json({message: "You are already a member"});
    }
    // 3. Check already pending
    const isAlreadyPending = room.pendingRequests.some(pendingUserId => pendingUserId.toString() === userId);
    if (isAlreadyPending) {
      return res.status(400).json({message: "Join request already pending"});
    }
    // 4. Check room limit
    if (room.members.length >= room.settings.maxUsers){
      return res.status(400).json({message: "Room is full"});
    }
    // 5. Public room -> direct join
    if (!room.settings.isPrivate) {
      room.members.push({user: userId,role: "member"});
      await room.save();
      return res.status(200).json({message: "Joined room successfully",payload: room});
    }

    // 6. Private room -> add to pending
    room.pendingRequests.push(userId);
    await room.save();
    res.status(200).json({message: "Join request sent successfully"});
  } catch (error) {
    console.log("Error requesting join:", error);
    res.status(500).json({message: "Server error"});
  }
};

/*
example

if User:
    userId = abc123
tries joining room:
    roomId = room789
--------------------------------------------------------
CASE 1 -> User already member
Room {
    roomId: "room789",
    members: [{user: "abc123",role: "member"}]
}
response:
{
   "message":"You are already a member"
}
--------------------------------------------------------

CASE 2 -> User already requested
Room {
  roomId: "room789",
  pendingRequests: ["abc123"]
  }
response:
{
   "message":"Join request already pending"
}
--------------------------------------------------------
CASE 3 -> Public room
Room {
    roomId: "room789",
    settings: {
    isPrivate: false
    }
}
User gets added directly:

members: [
    {
        user: "abc123",
        role: "member"
    }
]
response:
{
   "message":"Joined room successfully"
}
--------------------------------------------------------
CASE 4 -> Private room

Room {
    roomId: "room789",
    settings: {
        isPrivate: true
    }
}

User gets added to pendingRequests:

pendingRequests: ["abc123"]

response:
{
   "message":"Join request sent successfully"
}
   */


// GET PENDING REQUESTS
export const getPendingRequests = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    // 1. Find room
    const room = await Room.findOne({ roomId }).populate("pendingRequests","username email profilePic");
    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }
    // 2. Check moderator/owner access
    const isModerator = room.members.some(
      member => member.user.toString() === userId &&(
          member.role === "owner" ||
          member.role === "moderator"
        )
    );
    //if not moderator/owner deny access
    if (!isModerator) {
      return res.status(403).json({message: "Access denied"});
    }
    res.status(200).json({message: "Pending requests fetched successfully",payload: room.pendingRequests});
  }
   catch (error) {
      console.log("Error fetching pending requests:", error);
        res.status(500).json({message: "Server error"});
  }
};



// APPROVE JOIN REQUEST
export const approveJoinRequest = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;

    // 1. Find room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }

    // 2. Check moderator/owner access
    const isModerator = room.members.some(
      member =>member.user.toString() === currentUserId &&
        (
          member.role === "owner" ||
          member.role === "moderator"
        )
    );

    if (!isModerator) {
      return res.status(403).json({message: "Access denied"});
    }

    // 3. Check pending request exists
    const isPending = room.pendingRequests.some(pendingUserId => pendingUserId.toString() === userId); //some returns true if found else false
    if (!isPending) {
        return res.status(400).json({message: "No pending request found"});
    }

    // 4. Check room full
    if (room.members.length >= room.settings.maxUsers) {
      return res.status(400).json({message: "Room is full"});
    }

    // 5. Remove from pending
    room.pendingRequests = room.pendingRequests.filter(
      pendingUserId => pendingUserId.toString() !== userId
    );

    // 6. Add to members
    room.members.push({user: userId,role: "member"});
    await room.save();
    res.status(200).json({message: "Join request approved successfully"});

  } 
    catch (error) {
    console.log("Error approving request:", error);
    res.status(500).json({message: "Server error"});
  }
};


// REJECT JOIN REQUEST

export const rejectJoinRequest = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;

    // 1. Find room
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }

    // 2. Check moderator/owner access
    const isModerator = room.members.some(member =>member.user.toString() === currentUserId &&
        (
          member.role === "owner" ||
          member.role === "moderator"
        )
    );

    if (!isModerator) {
        return res.status(403).json({message: "Access denied"});
    }

    // 3. Remove pending request
    room.pendingRequests = room.pendingRequests.filter(pendingUserId => pendingUserId.toString() !== userId);
    await room.save();
    res.status(200).json({message: "Join request rejected successfully"});

  } 
    catch (error) {
    console.log("Error rejecting request:", error);
    res.status(500).json({message: "Server error"});
  }
};