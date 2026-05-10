import Room from "../../../models/Room.js";

export const codeChangeHandler = (io, socket) => {
  // Legacy code change & File-specific code change
  socket.on("code_change", async (data) => {
    try {
      const { roomId, fileId, code } = data;
      if (!roomId || code === undefined) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) return socket.emit("error", { message: "Access denied" });

      if (fileId) {
        const file = room.files.find(f => f.id === fileId);
        if (file) file.code = code;
      } else {
        // Fallback for legacy
        room.code = code;
      }
      
      await room.save();
      socket.to(roomId).emit("code_updated", { fileId, code, userId: socket.userId });
    } catch (err) {
      console.error("codeChangeHandler error:", err);
    }
  });

  socket.on("language_change", async (data) => {
    try {
      const { roomId, fileId, language, name } = data;
      if (!roomId || !language) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) return socket.emit("error", { message: "Access denied" });

      if (fileId) {
        const file = room.files.find(f => f.id === fileId);
        if (file) {
          file.language = language;
          if (name) file.name = name;
        }
      } else {
        room.language = language;
      }
      
      await room.save();
      socket.to(roomId).emit("language_updated", { fileId, language, name, userId: socket.userId });
    } catch (err) {
      console.error("language_change error:", err);
    }
  });

  socket.on("add_file", async (data) => {
    try {
      const { roomId, file } = data;
      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some((member) => member.user.toString() === socket.userId);
      if (!isMember) return;

      room.files.push(file);
      await room.save();
      io.to(roomId).emit("file_added", { file, userId: socket.userId });
    } catch (err) {
      console.error("add_file error:", err);
    }
  });

  socket.on("delete_file", async (data) => {
    try {
      const { roomId, fileId } = data;
      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some((member) => member.user.toString() === socket.userId);
      if (!isMember) return;

      room.files = room.files.filter(f => f.id !== fileId);
      await room.save();
      io.to(roomId).emit("file_deleted", { fileId, userId: socket.userId });
    } catch (err) {
      console.error("delete_file error:", err);
    }
  });
};