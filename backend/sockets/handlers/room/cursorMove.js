export const cursorMoveHandler = (io, socket) => {
  socket.on("cursor_move", (data) => {
    try {
      const { roomId, position } = data;
      if (!roomId || position === undefined) return;
      socket.to(roomId).emit("cursor_updated", {
        userId: socket.userId,
        socketId: socket.id,
        position,
      });
    } catch (err) {
      console.error("cursorMoveHandler error:", err);
    }
  });
};