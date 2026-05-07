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

      // Persist to DB
      room.code = code;
      await room.save();

      socket.to(roomId).emit("code_updated", { code, userId: socket.userId });
    } catch (err) {
      console.error("codeChangeHandler error:", err);
    }
  });

  socket.on("language_change", async (data) => {
    try {
      const { roomId, language } = data;
      if (!roomId || !language) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      // Persist to DB
      room.language = language;
      await room.save();

      socket.to(roomId).emit("language_updated", { language, userId: socket.userId });
    } catch (err) {
      console.error("language_change error:", err);
    }
  });
};