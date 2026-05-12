import cookieParser from "cookie-parser";
import cors from 'cors'
import exp from "express";
import router from "./routes/authRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import codeRouter from "./routes/codeRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";

const app =exp();
//unable cors 
app.use(cors({
  origin:["http://localhost:5174", "http://localhost:5173"
],
  credentials:true
}))
// Body parser
app.use(exp.json());

// Cookie parser
app.use(cookieParser());

//routes write all the routes here
//app.use()
app.use("/api/auth", router);
app.use("/api/room", roomRouter);
app.use("/api/code",codeRouter);
app.use("/api/chat", chatRoutes);

//to handle invalid path
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).json({ message: `path ${req.url} is invalid` });
});


//error handling middleware
app.use((err, req, res, next) => {
  console.log("error is ",err)
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});

// Export app for Vercel serverless
export default app;
