export const typingHandler = (io, socket) => {
  socket.on("typing", (data) => {
    try {
      const { roomId } = data;
      if (!roomId) return;
      socket.to(roomId).emit("user_typing", { userId: socket.userId });
    } catch (err) {
      console.error("typingHandler error:", err);
    }
  });
};