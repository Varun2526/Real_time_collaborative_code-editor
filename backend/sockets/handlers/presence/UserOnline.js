import UserModel from "../../../models/User.js";
export const userOnlineHandler = async (io,socket) => {
  await UserModel.findByIdAndUpdate(socket.userId,{socketId: socket.id});
  socket.broadcast.emit("user_online",{userId: socket.userId});
};