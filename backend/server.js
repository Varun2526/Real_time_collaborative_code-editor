import { config } from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./sockets/index.js";
import { corsOptions } from "./config/cors.js";

config();

//connect to db
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

initSocket(io);

//run the server

const port = process.env.PORT || 4000;

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`LAN access: http://192.168.0.116:${port}`);
});


export default app;

