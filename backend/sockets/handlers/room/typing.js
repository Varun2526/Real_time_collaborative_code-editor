export const typingHandler = (io,socket) => {
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("user_typing",{userId: socket.userId});
  });
};