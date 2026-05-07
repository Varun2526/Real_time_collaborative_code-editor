import Room from "../models/Room.js";
import UserModel from "../models/User.js";

const registerRoomSocket = (io, socket) => {

  // JOIN ROOM
  socket.on("join_room", async ({ roomId }) => {
    try {
      // 1. find room
      const room = await Room.findOne({ roomId });
      if (!room) {
        socket.emit("error", {
          message: "Room not found"
        });
        return;
      }
      // 2. check membership
      const isMember = room.members.some(
        member => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", {
          message: "Access denied"
        });
        return;
      }
      // 3. join room
      socket.join(roomId);
      // 4. update current room
      await UserModel.findByIdAndUpdate(
        socket.userId,
        { currentRoom: roomId }
      );
      console.log(
        `${socket.userId} joined ${roomId}`
      );
      // 5. notify room
      socket.to(roomId).emit(
        "user_joined",
        { userId: socket.userId }
      );
      // 6. success
      socket.emit("room_joined", {
        roomId
      });
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Server error" });
    }
  });
  // LEAVE ROOM
  socket.on("leave_room", async ({ roomId }) => {
    try {
      socket.leave(roomId);
      await UserModel.findByIdAndUpdate(
        socket.userId,
        { currentRoom: null }
      );
      socket.to(roomId).emit(
        "user_left",
        { userId: socket.userId }
      );
      socket.emit("room_left", { roomId });
    } catch (error) {
      console.log(error);
    }
  });
};
export default registerRoomSocket;