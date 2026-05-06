import { Schema, model } from 'mongoose';

const roomSchema = new Schema({

  roomId: {
    type: String,
    required: [true, "Please provide a room id"],
    unique: true,
    trim: true
  },

  code: {
    type: String,
    default: ""
  },

  language: {
    type: String,
    enum: [
      "javascript",
      "python",
      "java",
      "c++",
      "c",
      "ruby",
      "go",
      "php"
    ],
    default: "javascript"
  },

  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      role: {
        type: String,
        enum: ["owner", "moderator", "member"],
        default: "member"
      }
    }
  ],

  pendingRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  settings: {
  isPrivate: {
    type: Boolean,
    default: true
  },
  allowGuests: {
    type: Boolean,
    default: false
  },

  maxUsers: {
    type: Number,
    default: 10
  }

}

}, {
  versionKey: false,
  timestamps: true,
  strict: "throw"
});

const Room = model("Room", roomSchema);

export default Room;