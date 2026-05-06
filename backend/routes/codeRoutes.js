import express from "express"
import { getCode } from "../controllers/codeController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const codeRouter = express.Router();

//Get code from DB

codeRouter.get("/:roomId",verifyToken,getCode)

export default codeRouter