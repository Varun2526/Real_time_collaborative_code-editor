import Room from "../../../models/Room.js";

export const runCodeHandler = (io, socket) => {
  socket.on("run_code", async (data) => {
    try {
      const { roomId, code, language } = data;
      if (!roomId) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      // Verify membership
      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      // Notify all room members that code is being run
      io.to(roomId).emit("code_running", { userId: socket.userId, language });

      // NOTE: Actual code execution should be done here (e.g. via a sandboxed service).
      // For now, emit a placeholder result back to the requester only.
      socket.emit("code_result", {
        output: "// Code execution service not yet connected.",
        error: null,
      });
    } catch (err) {
      console.error("runCodeHandler error:", err);
      socket.emit("error", { message: "Failed to run code" });
    }
  });
};