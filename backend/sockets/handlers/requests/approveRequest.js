import Room from "../../../models/Room.js";
import { emitToUser } from "../../utils/emitToUser.js";

export const approveRequestHandler = (io, socket) => {
  socket.on("approve_request", async (data) => {
    try {
      const { roomId, userId } = data;
      if (!roomId || !userId) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      // Only owners/moderators can approve
      const isModerator = room.members.some(
        (member) =>
          member.user.toString() === socket.userId &&
          (member.role === "owner" || member.role === "moderator")
      );
      if (!isModerator) {
        socket.emit("error", { message: "Access denied: only owners/moderators can approve requests" });
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

      // Check room capacity before approving
      if (room.members.length >= room.settings.maxUsers) {
        socket.emit("error", { message: "Room is full, cannot approve" });
        return;
      }

      // Remove from pending and add as member
      room.pendingRequests = room.pendingRequests.filter(
        (id) => id.toString() !== userId
      );
      room.members.push({ user: userId, role: "member" });
      await room.save();

      // Notify the approved user
      await emitToUser(io, userId, "join_request_approved", { roomId });
    } catch (err) {
      console.error("approveRequestHandler error:", err);
      socket.emit("error", { message: "Failed to approve join request" });
    }
  });
};