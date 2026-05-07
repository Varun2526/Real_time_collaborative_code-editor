export const emitToRoom = (io, roomId, event, payload, excludedSocketId = null) => {
  if (excludedSocketId) {
    return io
      .to(roomId)
      .except(excludedSocketId)
      .emit(event, payload);
  }
  io.to(roomId).emit(event, payload);
};