import Room from "../../../models/Room.js";
import https from "https";

const JDOODLE_LANGUAGE_MAP = {
  "javascript": { language: "nodejs", versionIndex: "4" },
  "python": { language: "python3", versionIndex: "4" },
  "java": { language: "java", versionIndex: "4" },
  "c++": { language: "cpp17", versionIndex: "1" },
  "c": { language: "c", versionIndex: "5" },
  "ruby": { language: "ruby", versionIndex: "4" },
  "go": { language: "go", versionIndex: "4" },
  "php": { language: "php", versionIndex: "4" }
};

export const runCodeHandler = (io, socket) => {
  socket.on("run_code", async (data) => {
    try {
      const { roomId, code, language, stdin } = data;
      if (!roomId) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      // Verify membership
      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      // Notify all room members that code is being run
      io.to(roomId).emit("code_running", { userId: socket.userId, language });

      // Ensure API keys are present
      const clientId = process.env.JDOODLE_CLIENT_ID;
      const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        io.to(roomId).emit("code_result", { 
          output: "JDoodle API keys are missing. Please add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to the backend .env file and restart the server.", 
          error: true 
        });
        return;
      }

      const jdoodleConfig = JDOODLE_LANGUAGE_MAP[language] || JDOODLE_LANGUAGE_MAP["javascript"];
      
      const payload = JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret,
        script: code || "",
        stdin: stdin || "",
        language: jdoodleConfig.language,
        versionIndex: jdoodleConfig.versionIndex
      });

      const options = {
        hostname: 'api.jdoodle.com',
        path: '/v1/execute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(responseBody);
            let output = "No output generated.";
            let isError = false;

            if (result.statusCode === 200) {
              output = result.output;
            } else {
              isError = true;
              output = result.error || "Execution failed via JDoodle.";
            }

            // Broadcast result back to the room
            io.to(roomId).emit("code_result", {
              output: output,
              error: isError,
            });
          } catch (parseError) {
            console.error("JDoodle parse error:", parseError);
            io.to(roomId).emit("code_result", { output: "Error parsing execution result.", error: true });
          }
        });
      });

      req.on('error', (e) => {
        console.error(`Problem with JDoodle request: ${e.message}`);
        io.to(roomId).emit("code_result", { output: "Execution API failed.", error: true });
      });

      req.write(payload);
      req.end();

    } catch (err) {
      console.error("runCodeHandler error:", err);
      socket.emit("code_result", { output: "Failed to process run request.", error: true });
    }
  });

  socket.on("code_output", async (data) => {
    try {
      const { roomId, output } = data;
      if (!roomId || output === undefined) return;

      const room = await Room.findOne({ roomId });
      if (!room) return;

      const isMember = room.members.some(
        (member) => member.user.toString() === socket.userId
      );
      if (!isMember) {
        socket.emit("error", { message: "Access denied" });
        return;
      }

      io.to(roomId).emit("code_output_received", { output, userId: socket.userId });
    } catch (err) {
      console.error("code_output error:", err);
    }
  });
};