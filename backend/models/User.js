import {Schema,model} from 'mongoose';
const userSchema = new Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        unique:true,
        trim:true,
        lowercase:true
    },
   socketid:{
        type:String
    },
    currentRoom:{
        type:String,
        default: null
    }
},{
    timestamps:true,versionKey:false,strict:'throw'
});

export const UserModel = model('User',userSchema);

