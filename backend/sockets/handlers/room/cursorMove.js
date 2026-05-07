export const cursorMoveHandler = (  io,socket) => {
  socket.on("cursor_move", (data) => {
    socket.to(data.roomId).emit("cursor_updated",{userId: socket.userId, position: data.position});
  });
};