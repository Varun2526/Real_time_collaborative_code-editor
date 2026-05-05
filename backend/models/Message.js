import {Schema,model} from "mongoose";
import mongoose from "mongoose"
const MessageSchema = new Schema({
    roomId:{
        type: String,
        ref:"Room",
        required:[true,'roomId is required']
        
    },
    sender:{
        type:String,
        required:[true,'sender is required']
    },
    message:{
        type:String,
        required:[true,'Message is required']
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const MessageModel = model("Message",MessageSchema)