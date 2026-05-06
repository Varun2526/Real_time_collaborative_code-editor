import {Schema,model} from "mongoose";

const MessageSchema = new Schema({
    roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true
},
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'sender is required']
    },
    message:{
        type:String,
        maxlength:1000,
        required:[true,'Message is required']
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const MessageModel = model("Message",MessageSchema)