import UserModel from '../models/User.js';
export const initSocket=(io)=>{
     io.on("connection", async (socket) => {
    console.log("Connected:", socket.id);

    const username = socket.handshake.query.username;

    if (username) {
      await UserModel.findOneAndUpdate(
        { username },
        { socketId: socket.id }
      );
    }
    socket.on("disconnect", async () => {
      console.log("Disconnected:", socket.id);

      await UserModel.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null }
      );
    });
  });
};