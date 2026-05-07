import Room from "../../../models/Room.js";
import { emitToUser } from "../../utils/emitToUser.js";
export const requestJoinHandler = (io,socket) => {
  socket.on("request_join_room", async(data) => {
    const { roomId } = data;
    const room = await Room.findOne({ roomId }).populate("members.user");
    if (!room) return;
    room.pendingRequests.push(socket.userId);
    await room.save();
    const moderators = room.members.filter(member =>
      member.role === "owner" ||
      member.role === "moderator"
    );
    for (const moderator of moderators) {
      await emitToUser(io,moderator.user._id,"join_request_received",{roomId,userId: socket.userId});
    }
  });
};