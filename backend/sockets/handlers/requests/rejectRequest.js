import Room from "../../../models/Room.js";
import { emitToUser } from "../../utils/emitToUser.js";
export const rejectRequestHandler = (io,socket) => {
  socket.on("reject_request", async(data) => {
    const {roomId,userId} = data;
    const room = await Room.findOne({ roomId });
    if (!room) return;
    room.pendingRequests = room.pendingRequests.filter(id => id.toString() !== userId);
    await room.save();
    await emitToUser(io,userId,"join_request_rejected",{ roomId });
  });
};