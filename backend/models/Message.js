import {Schema,model} from "mongoose";

const MessageSchema = new Schema({
    roomId:{
        type: String,
        required:[true,'roomId is required'],
        trim:true
        
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'sender is required'],
        trim:true
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