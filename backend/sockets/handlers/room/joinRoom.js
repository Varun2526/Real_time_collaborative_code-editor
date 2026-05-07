export const joinRoomHandler = (  io,socket) => {
  socket.on("join_room", async(data) => {
    const { roomId } = data;
    socket.join(roomId);
    socket.to(roomId).emit("user_joined",{userId: socket.userId});
  });
};