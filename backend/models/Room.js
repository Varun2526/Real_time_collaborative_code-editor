import {Schema , model } from 'mongoose';

const roomSchema = new Schema({
    roomId:{
        type:String,
        required:[true,"Please provide a room id"],
        unique:true,
        trim:true
    },
    code:{
        type :String,
        default:""
        
    },
    language:{
        type:String,
        enum:["javascript","python","java","c++","c","ruby","go","php"],
        default:"javascript"
    },

},{
    versionKey:false,
    timestamps:true,
    strict:"throw"
});

const Room = model('Room',roomSchema);

export default Room;