import UserModel from "../../../models/User.js";

export const leaveRoomHandler = (io, socket) => {
  socket.on("leave_room", async ({ roomId }) => {
    try {
      if (!roomId) return;
      socket.leave(roomId);

      // Clear currentRoom tracking
      await UserModel.findByIdAndUpdate(socket.userId, { currentRoom: null });

      socket.to(roomId).emit("user_left", { userId: socket.userId });
    } catch (err) {
      console.error("leaveRoomHandler error:", err);
    }
  });
};