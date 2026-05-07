import Room from "../../../models/Room.js";
import { emitToUser } from "../../utils/emitToUser.js";

export const rejectRequestHandler = (io, socket) => {
  socket.on("reject_request", async (data) => {
    try {
      const { roomId, userId } = data;
      if (!roomId || !userId) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      // Only owners/moderators can reject
      const isModerator = room.members.some(
        (member) =>
          member.user.toString() === socket.userId &&
          (member.role === "owner" || member.role === "moderator")
      );
      if (!isModerator) {
        socket.emit("error", { message: "Access denied: only owners/moderators can reject requests" });
        return;
      }

      // Verify the request is actually pending
      const isPending = room.pendingRequests.some(
        (id) => id.toString() === userId
      );
      if (!isPending) {
        socket.emit("error", { message: "No pending request found for this user" });
        return;
      }

      // Remove from pending
      room.pendingRequests = room.pendingRequests.filter(
        (id) => id.toString() !== userId
      );
      await room.save();

      // Notify the rejected user
      await emitToUser(io, userId, "join_request_rejected", { roomId });
    } catch (err) {
      console.error("rejectRequestHandler error:", err);
      socket.emit("error", { message: "Failed to reject join request" });
    }
  });
};