import {Schema,model} from 'mongoose';
const userSchema = new Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        trim:true,    
    },

    password: {
    type: String,
    required: function () {
      return this.providers.length === 0 ||
        this.providers.some(p => p.name === "local");
        }
    },

    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email already exists'],
        trim:true,
        lowercase:true
    },
    
    profilePic:{
        type:String,
        default:null
    },
    
    providers: [
    {
        name: {
            type: String,
            enum: ['local', 'google', 'github'],
            required: true
        },
        providerId: {
            type: String,
            required: function () {
                return this.name !== "local";
            }
        }
    }
    ],


   socketId:{
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

