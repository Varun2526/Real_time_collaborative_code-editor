import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 1. Get token from cookie OR header (more flexible)
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 3. Attach only what you need
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (err) {
    // 4. Better error handling
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};