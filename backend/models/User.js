import {Schema,model} from 'mongoose';
const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:[true,'username is required'],
        trim:true,    
    },
    password: {
    type: String,
    required: function () {
        return (
        !this.providers ||
        this.providers.length === 0 ||
        this.providers.some(p => p.name === "local")
        );
  }
},

    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        trim:true,
        lowercase:true
    },
    
    profilePic:{
        type:String,
        default:null
    },
    
   providers: {
    type: [
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
  default: [{ name: "local" }]
},

   socketId:{
        type:String,
        default:null
    },

    currentRoom:{
        type:String,
        default: null
    },
    
},{
    timestamps:true,versionKey:false,strict:'throw'
});

const UserModel = model('User',userSchema);
export default UserModel;

