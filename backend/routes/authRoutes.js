import express from "express";
import { register } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);
// LOGIN
router.post("/login", login);

// 🔐 Protected test route
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

export default router;