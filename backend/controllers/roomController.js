import { v4 as uuidv4 } from "uuid";
import Room from "../models/Room.js";
import { MessageModel } from "../models/Message.js";

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {title,description,language,visibility, roomId: providedRoomId} = req.body;
        // VALIDATE TITLE
    if (!title) {
      return res.status(400).json({message: "Title is required"});
    }
    // VALIDATE VISIBILITY
    if (visibility && !["public", "private"].includes(visibility)) {
      return res.status(400).json({message: "Invalid visibility"});
    }
    const roomId = providedRoomId || uuidv4();
    const defaultExt = language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'javascript' ? 'js' : 'txt';
    const room = await Room.create({
      roomId,title,description,language,visibility,
      members: [{user: userId, role: "owner"}],
      files: [{ id: uuidv4(), name: `main.${defaultExt}`, language: language || 'javascript', code: '// Write your code here...' }]
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
    // BASE FILTER - ONLY PUBLIC ROOMS
    const filter = {visibility: "public"};
    // ADD TEXT SEARCH ONLY IF QUERY EXISTS
    if (q.trim()) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { language: { $regex: q, $options: "i" } }
      ];
    }
      const rooms = await Room.find(filter)
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
    const rooms = await Room.find({"members.user": userId})
      .select(`
        roomId
        title
        description
        language
        visibility
        createdAt
      `)
      .sort({createdAt: -1 });
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

    // CHECK ALREADY MEMBER
    const isAlreadyMember = room.members.some(member =>member.user.toString() === userId);

    if (isAlreadyMember) {
      return res.status(400).json({message: "User already member"});
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
    // CHECK PENDING EXISTS
    const isPending = room.pendingRequests.some(pendingUserId =>pendingUserId.toString() === userId);
    
    if (!isPending) {
      return res.status(400).json({message: "No pending request found"});
    }

    room.pendingRequests =room.pendingRequests.filter(pendingUserId =>pendingUserId.toString() !== userId);
    await room.save();

    return res.status(200).json({ message: "Join request rejected successfully" });
  } 
  catch (error) {
    console.log("Error rejecting request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PROMOTE MEMBER TO MODERATOR
export const promoteModerator = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    //  Verify that the user is owner or moderator
    const requester = room.members.find(member => member.user.toString() === currentUserId);
    if (!requester || (requester.role !== "owner" && requester.role !== "moderator")) {
      return res.status(403).json({ message: "Only owners and moderators can promote members" });
    }
    const targetMember = room.members.find(member => member.user.toString() === userId);  
    
    if (!targetMember) {
      return res.status(404).json({ message: "User is not a member of this room" });
    }
    // Prevent promoting someone who is already the owner
    if (targetMember.role === "owner") {
      return res.status(400).json({ message: "User is already the owner" });
    }
    // Prevent promoting someone who is already a moderator
    if (targetMember.role === "moderator") {
      return res.status(400).json({ message: "User is already a moderator" });
    }
    // 9. Update the target member's role to "moderator"
    targetMember.role = "moderator";  
    await room.save();
    return res.status(200).json({ message: "Member promoted to moderator successfully" });
  }
   catch (error) {
    console.log("Error promoting member:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DEMOTE MODERATOR TO MEMBER
export const demoteModerator = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const requester = room.members.find(member => member.user.toString() === currentUserId);
    if (!requester || (requester.role !== "owner" && requester.role !== "moderator")) {
      return res.status(403).json({ message: "Only owners and moderators can demote members" });
    }

    const targetMember = room.members.find(member => member.user.toString() === userId);

    if (!targetMember) {
      return res.status(404).json({ message: "User is not a member of this room" });
    }
    if (targetMember.role !== "moderator") {
      return res.status(400).json({ message: "User is not a moderator" });
    }
    targetMember.role = "member";
    await room.save();
    return res.status(200).json({ message: "Moderator demoted to member successfully" });
  } 
  catch (error) {
    console.log("Error demoting moderator:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// TRANSFER ROOM OWNERSHIP
export const transferOwnership = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const currentOwner = room.members.find(member => member.user.toString() === currentUserId);

    if (!currentOwner || currentOwner.role !== "owner") {
      return res.status(403).json({ message: "Only the owner can transfer ownership" });
    }

    const targetMember = room.members.find(member => member.user.toString() === userId);
    
    if (!targetMember) {
      return res.status(404).json({ message: "User is not a member of this room" });
    }
    
    if (targetMember.role === "owner") {
      return res.status(400).json({ message: "User is already the owner" });
    }
    targetMember.role = "owner";
    currentOwner.role = "moderator"; 
    await room.save();
    return res.status(200).json({ message: "Ownership transferred successfully" });
  } 
  catch (error) {
    console.log("Error transferring ownership:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ROOM SETTINGS
export const updateRoomSettings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user.userId;
    const { title, description, visibility, allowGuests, maxUsers } = req.body;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isModeratorOrOwner = room.members.some(member => 
      member.user.toString() === currentUserId && (member.role === "owner" || member.role === "moderator")
    );

    if (!isModeratorOrOwner) {
      return res.status(403).json({ message: "Only owners or moderators can update room settings" });
    }

    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (visibility !== undefined) {
      if (!["public", "private"].includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility" });
      }
      room.visibility = visibility;
    }
    

    if (allowGuests !== undefined) 
      room.settings.allowGuests = allowGuests;
    if (maxUsers !== undefined)
       room.settings.maxUsers = maxUsers;
    await room.save();

    // Return populated room data
    const updatedRoom = await Room.findOne({ roomId }).populate("members.user", "username email profilePic");
    return res.status(200).json({ message: "Room settings updated successfully", payload: updatedRoom });
  } 
    catch (error) {
    console.log("Error updating room settings:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isOwner = room.members.some(member => member.user.toString() === currentUserId && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can delete the room" });
    }
    await MessageModel.deleteMany({ roomId: room._id });
    
    await Room.deleteOne({ _id: room._id });
    return res.status(200).json({ message: "Room and associated messages deleted successfully" });
  }
   catch (error) {
    console.log("Error deleting room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LEAVE ROOM
export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const memberIndex = room.members.findIndex(member => member.user.toString() === currentUserId);
    if (memberIndex === -1) {
      return res.status(400).json({ message: "You are not a member of this room" });
    }

    const memberRole = room.members[memberIndex].role;

    // If owner leaves
    if (memberRole === "owner") {
      // Find a moderator to promote
      let nextOwner = room.members.find(member => member.role === "moderator" && member.user.toString() !== currentUserId);
      
      // If no moderator, find any member
      if (!nextOwner) {
        nextOwner = room.members.find(member => member.role === "member" && member.user.toString() !== currentUserId);
      }

      if (nextOwner) {
        nextOwner.role = "owner";
      } else {
        // If no one else is in the room, delete the room completely
        await MessageModel.deleteMany({ roomId: room._id });
        await Room.deleteOne({ _id: room._id });
        return res.status(200).json({ message: "Left room. Room deleted as it was empty." });
      }
    }

    // Remove the user from members array
    room.members.splice(memberIndex, 1);
    await room.save();

    return res.status(200).json({ message: "Left room successfully" });
  } 
  catch (error) {
    console.log("Error leaving room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const currentUserId = req.user.userId;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const requester = room.members.find(member => member.user.toString() === currentUserId);
    if (!requester || (requester.role !== "owner" && requester.role !== "moderator")) {
      return res.status(403).json({ message: "Only owners or moderators can remove members" });
    }

    const targetIndex = room.members.findIndex(member => member.user.toString() === userId);
    if (targetIndex === -1) {
      return res.status(404).json({ message: "User is not a member of this room" });
    }

    const targetMember = room.members[targetIndex];

    // Moderators cannot remove owners
    if (requester.role === "moderator" && targetMember.role === "owner") {
      return res.status(403).json({ message: "Moderators cannot remove the owner" });
    }

    // Owner cannot remove themselves via this route (they should use leave route)
    if (userId === currentUserId) {
       return res.status(400).json({ message: "Use the leave room endpoint to remove yourself" });
    }

    room.members.splice(targetIndex, 1);
    await room.save();

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.log("Error removing member:", error);
    return res.status(500).json({ message: "Server error" });
  }
};