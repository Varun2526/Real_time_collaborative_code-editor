import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
export const initSocket=(io)=>{
  
     io.on("connection", async (socket) => {
      try{
        console.log("Connected:", socket.id);
        // get token 
        const token = socket.handshake.auth.token;
        if(!token){
          socket.disconnect();
          return;
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // save userId in socket object
        socket.userId = decoded.userId;
        //update socketId
        await UserModel.findByIdAndUpdate(decoded.userId, { socketId: socket.id });
        console.log("Socket authenticated for userId:", decoded.userId);
        //Disconnect handler
        socket.on("disconnect", async () => {
          console.log("Disconnected:", socket.id);
          await UserModel.findByIdAndUpdate(decoded.userId, { socketId: null });
        }
        );
      }catch(error){
        console.log("Socket connection error:", error);
        socket.disconnect();
      }
    });
};