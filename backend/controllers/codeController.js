import Room from "../models/Room.js";


//Getting code of a room
export const getCode = async(req,res) =>{
    try{
        const {roomId} = req.params;

        

        const room = await Room.findOne({roomId})

        if(!room){
            return res.status(404).json({message:"Room not found"})
            
        }
        res.status(200).json({
            message:"Code fetched successfully",
            payload:{
                code: room.code,
                language:room.language
            }

        })
    }catch(error){
        console.log(error)

        res.status(500).json({
            message:"Server error"
        })
    }
}


// Save code inka rayali 
////////////PENDING///////////////////