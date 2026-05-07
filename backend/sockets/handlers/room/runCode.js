export const runCodeHandler = (io,socket) => {
  socket.on("run_code", async(data) => {
    io.to(data.roomId).emit("code_running",{ userId: socket.userId });
  });
};