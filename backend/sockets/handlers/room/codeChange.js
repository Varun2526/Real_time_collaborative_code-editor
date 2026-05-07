import Room from "../../../models/Room.js";

export const codeChangeHandler = (io, socket) => {
  socket.on("code_change", async (data) => {
    try {
      const { roomId, code } = data;
      if (!roomId || code === undefined) return;

      // Verify membership before broadcasting
      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      socket.to(roomId).emit("code_updated", { code, userId: socket.userId });
    } catch (err) {
      console.error("codeChangeHandler error:", err);
    }
  });
};