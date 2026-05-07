export const codeChangeHandler = (io,socket) => {
  socket.on("code_change", (data) => {
    const {roomId,code} = data;
    socket.to(roomId).emit("code_updated",{code,userId: socket.userId});
  });
};