import UserModel from "../../../models/User.js";
export const disconnectHandler = (  io,socket) => {
  socket.on("disconnect", async () => {
    await UserModel.findByIdAndUpdate(socket.userId,{socketId: null});
    socket.broadcast.emit("user_offline",{userId: socket.userId});
    console.log("Disconnected:", socket.id);
  });
};