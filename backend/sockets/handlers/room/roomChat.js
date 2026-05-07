import { MessageModel } from "../../../models/Message.js";
import Room from "../../../models/Room.js";

export const roomChatHandler = (io, socket) => {
  socket.on("send_message", async (data) => {
    try {
      const { roomId, message } = data;
      if (!roomId || !message) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      // Verify membership before saving/emitting
      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      // Save the message and populate sender so clients receive full user info
      const newMessage = await MessageModel.create({
        roomId: room._id,
        sender: socket.userId,
        message,
      });

      const populated = await newMessage.populate(
        "sender",
        "username email profilePic"
      );

      io.to(roomId).emit("receive_message", populated);
    } catch (err) {
      console.error("roomChatHandler error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};