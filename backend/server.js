import { config } from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./sockets/socketHandler.js";

config();

//connect to db
connectDB();

const server = http.createServer(app);
const io = new Server(server,{cors:{origin:"*"}});

initSocket(io);

//run the server

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

