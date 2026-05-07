import UserModel from "../../../models/User.js";

export const disconnectHandler = (io, socket) => {
  socket.on("disconnect", async () => {
    try {
      // Clear socket ID and currentRoom on disconnect
      await UserModel.findByIdAndUpdate(socket.userId, {
        socketId: null,
        currentRoom: null,
      });
      socket.broadcast.emit("user_offline", { userId: socket.userId });
      console.log("Disconnected:", socket.id);
    } catch (err) {
      console.error("disconnectHandler error:", err);
    }
  });
};