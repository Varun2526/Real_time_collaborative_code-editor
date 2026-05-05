import {Schema,model} from 'mongoose';
const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
   socketid:{
        type:String,
        required:true
    },
    currentRoom:{
        type:String,
        default:''
    }
},{
    timestamps:true
});

export const User = model('User',userSchema);

