import Room from "../../../models/Room.js";
import UserModel from "../../../models/User.js";

export const joinRoomHandler = (io, socket) => {
  socket.on("join_room", async (data) => {
    try {
      const { roomId } = data;
      if (!roomId) return;

      // Verify the user is actually a member of this room
      const room = await Room.findOne({ roomId }).populate(
        "members.user",
        "username email profilePic"
      );
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const isMember = room.members.some(
        (member) => member.user._id.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied: you are not a member of this room" });
        return;
      }

      // Join the socket room
      socket.join(roomId);

      // Track which room the user is currently in
      await UserModel.findByIdAndUpdate(socket.userId, { currentRoom: roomId });

      // Notify others in the room
      const joiningMember = room.members.find(
        (m) => m.user._id.toString() === socket.userId
      );
      socket.to(roomId).emit("user_joined", {
        userId: socket.userId,
        username: joiningMember?.user?.username || null,
        role: joiningMember?.role || "member",
      });
    } catch (err) {
      console.error("joinRoomHandler error:", err);
      socket.emit("error", { message: "Failed to join room" });
    }
  });
};