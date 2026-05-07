import express from "express";
import { register } from "../controllers/authController.js";
import { login, logout, googleAuth } from "../controllers/authController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);
// LOGIN
router.post("/login", login);

// GOOGLE LOGIN
router.post("/google", googleAuth);

//logout 
router.post("/logout", logout);
// 🔐 Protected test route
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

export default router;