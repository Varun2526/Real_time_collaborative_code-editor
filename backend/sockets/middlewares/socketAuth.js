import jwt from "jsonwebtoken";
export const socketAuth = (socket, next) => {
  try {
    const cookieString = socket.handshake.headers.cookie || "";
    let token = socket.handshake.auth.token;

    // Fallback to parsing cookies if token is not in auth
    if (!token && cookieString) {
      const cookies = Object.fromEntries(
        cookieString.split('; ').map(c => c.split('='))
      );
      token = cookies.token;
    }

    if (!token) {
      return next(new Error("Unauthorized: Token missing"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } 
  catch (error) {
    next(new Error("Unauthorized: Invalid token"));
  }
};