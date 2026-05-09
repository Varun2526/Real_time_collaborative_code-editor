import express from "express";
import { register } from "../controllers/authController.js";
import { login, logout, googleAuth, githubAuth, getMe } from "../controllers/authController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);
// LOGIN
router.post("/login", login);

// GOOGLE LOGIN
router.post("/google", googleAuth);

// GITHUB LOGIN
router.post("/github", githubAuth);

//logout 
router.post("/logout", logout);
// 🔐 Protected test route
router.get("/me", verifyToken, getMe);

export default router;