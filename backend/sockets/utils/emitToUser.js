import UserModel from "../../models/User.js";
export const emitToUser = async (io, userId, event, payload) => {
  const user = await UserModel.findById(userId);
  if (!user || !user.socketId) return;
  io.to(user.socketId).emit(event, payload);
};