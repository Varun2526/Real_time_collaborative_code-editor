import { MessageModel } from "../../../models/Message.js";
import Room from "../../../models/Room.js";
export const roomChatHandler = (io,socket) => {
  socket.on("send_message", async(data) => {const {roomId,message} = data;
    const room = await Room.findOne({roomId});
    if (!room) return;
    const newMessage = await MessageModel.create({
      roomId: room._id,
      sender: socket.userId,
      message
    });
    io.to(roomId).emit("receive_message",newMessage);
  });

};