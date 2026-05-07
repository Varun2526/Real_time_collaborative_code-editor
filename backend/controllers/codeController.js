import Room from "../models/Room.js";


//Getting code of a room
export const getCode = async (req, res) => {
  try {
    const { roomId } = req.params;
    // find room
    const room = await Room.findOne({ roomId });
    // room not found
    if (!room) {
        return res.status(404).json({message: "Room not found"});
    }
    // check if current user is member
    const isMember = room.members.some( member =>member.user.toString() === req.user.userId);

    // deny access
    if (!isMember) {
      return res.status(403).json({message: "Access denied"});
    }

    // response
    res.status(200).json({message: "Code fetched successfully",payload: {code: room.code,language: room.language}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }
};


//save or update code of a room
export const saveCode = async (req, res) => {
  try {

    const { roomId } = req.params;
    const { code, language } = req.body;

    // validate code
    if (code === undefined) {
      return res.status(400).json({message: "Code is required"});
    }

    // validate language
    const allowedLanguages = [
      "javascript",
      "python",
      "java",
      "c++",
      "c",
      "ruby",
      "go",
      "php"
    ];

    if (
      language &&!allowedLanguages.includes(language)
    ) {
      return res.status(400).json({ message: "Invalid language"});
    }
    // find room
    const room = await Room.findOne({ roomId });
    // room not found
    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }

    // check if current user is member
    const isMember = room.members.some(member =>member.user.toString() === req.user.userId);
    // deny access
    if (!isMember) {
      return res.status(403).json({ message: "Access denied"});
    }

    // update code
    room.code = code;
    // update language if provided
    if (language) {
      room.language = language;
    }
    // save room
    await room.save();
    // response
    res.status(200).json({message: "Code saved successfully",payload: {code: room.code,language: room.language}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }
};