import jwt from "jsonwebtoken";
export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } 
  catch (error) {
    next(new Error("Unauthorized"));
  }
};