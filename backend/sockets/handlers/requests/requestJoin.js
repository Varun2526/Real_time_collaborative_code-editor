import Room from "../../../models/Room.js";
import { emitToUser } from "../../utils/emitToUser.js";

export const requestJoinHandler = (io, socket) => {
  socket.on("request_join_room", async (data) => {
    try {
      const { roomId } = data;
      if (!roomId) return;

      const room = await Room.findOne({ roomId }).populate("members.user");
      if (!room) return;

      // Prevent joining if already a member
      const isAlreadyMember = room.members.some(
        (member) => member.user._id.toString() === socket.userId
      );
      if (isAlreadyMember) {
        socket.emit("error", { message: "You are already a member of this room" });
        return;
      }

      // Prevent duplicate pending requests
      const isAlreadyPending = room.pendingRequests.some(
        (id) => id.toString() === socket.userId
      );
      if (isAlreadyPending) {
        socket.emit("error", { message: "Join request already pending" });
        return;
      }

      // Check room capacity
      if (room.members.length >= room.settings.maxUsers) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      room.pendingRequests.push(socket.userId);
      await room.save();

      // Notify all owners and moderators
      const moderators = room.members.filter(
        (member) => member.role === "owner" || member.role === "moderator"
      );
      for (const moderator of moderators) {
        await emitToUser(io, moderator.user._id, "join_request_received", {
          roomId,
          userId: socket.userId,
        });
      }
    } catch (err) {
      console.error("requestJoinHandler error:", err);
      socket.emit("error", { message: "Failed to send join request" });
    }
  });
};