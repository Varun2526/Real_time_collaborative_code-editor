import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    // Unique Room ID
    roomId: {
      type: String,
      required: [true, "Please provide a room id"],
      unique: true,
      trim: true,
      index: true
    },

    // Room Title (used in global search)
    title: {
      type: String,
      required: [true, "Please provide room title"],
      trim: true,
      maxlength: 100
    },

    // Optional Room Description
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300
    },

    // Shared Collaborative Code
    code: {
      type: String,
      default: ""
    },

    // Programming Language
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

    // Room Members
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
        },

        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Join Requests
    pendingRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Room Visibility
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true
    },

    // Room Settings
    settings: {
      allowGuests: {
        type: Boolean,
        default: false
      },

      maxUsers: {
        type: Number,
        default: 10
      }
    }
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw"
  }
);

// Full Text Search Index
roomSchema.index({
  title: "text",
  description: "text",
  language: "text"
});

const Room = model("Room", roomSchema);

export default Room;