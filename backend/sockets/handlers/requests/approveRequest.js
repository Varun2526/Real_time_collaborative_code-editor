import Room from "../../../models/Room.js";
import { emitToUser } from "../../utils/emitToUser.js";
export const approveRequestHandler = (io,socket) => {
  socket.on("approve_request", async(data) => {
    const {roomId,userId} = data;
    const room = await Room.findOne({ roomId });
    if (!room) return;
    room.pendingRequests = room.pendingRequests.filter(id => id.toString() !== userId);
    room.members.push({user: userId, role: "member"});
    await room.save();
    await emitToUser(io,userId,"join_request_approved",{ roomId });
  });
};