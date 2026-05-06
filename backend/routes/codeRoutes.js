import express from "express"
import { getCode,saveCode } from "../controllers/codeController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const codeRouter = express.Router();

//Get code from DB

codeRouter.get("/:roomId",verifyToken,getCode)

//save or Update Code
codeRouter.put("/:roomId",verifyToken,saveCode)

export default codeRouter