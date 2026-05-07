export const leaveRoomHandler = (  io,socket) => {
  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user_left",{userId: socket.userId});
  });
};