import express from "express";
import { register } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";
const router = express.Router();

// REGISTER
router.post("/register", register);
// LOGIN
router.post("/login", login);

export default router;