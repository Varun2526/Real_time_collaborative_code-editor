import { socketAuth } from "./middleware/socketAuth.js";
import { userOnlineHandler } from "./handlers/presence/userOnline.js";
import { disconnectHandler } from "./handlers/presence/disconnect.js";
import { joinRoomHandler } from "./handlers/room/joinRoom.js";
import { leaveRoomHandler } from "./handlers/room/leaveRoom.js";
import { codeChangeHandler } from "./handlers/room/codeChange.js";
import { cursorMoveHandler } from "./handlers/room/cursorMove.js";
import { typingHandler } from "./handlers/room/typing.js";
import { roomChatHandler } from "./handlers/room/roomChat.js";
import { runCodeHandler } from "./handlers/room/runCode.js";
import { requestJoinHandler } from "./handlers/requests/requestJoin.js";
import { approveRequestHandler } from "./handlers/requests/approveRequest.js";
import { rejectRequestHandler } from "./handlers/requests/rejectRequest.js";

export const initSocket = (io) => {
  //socket authentication middleware
  io.use(socketAuth);
  // Socket connection handler
  io.on("connection", async(socket) => {
    console.log("Connected:", socket.id);
    //user online handler
    await userOnlineHandler(io, socket);
    //disconnect handler
    disconnectHandler(io, socket);
    // Room event handlers
    joinRoomHandler(io, socket);
    leaveRoomHandler(io, socket);
    codeChangeHandler(io, socket);
    cursorMoveHandler(io, socket);
    typingHandler(io, socket);
    roomChatHandler(io, socket);
    runCodeHandler(io, socket);

    // Join request handlers
    requestJoinHandler(io, socket);
    approveRequestHandler(io, socket);
    rejectRequestHandler(io, socket);
  });
};