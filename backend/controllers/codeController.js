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



// save or update code
export const saveCode = async(req,res) =>{
    try{
        const {roomId} = req.params
        const {code, language} = req.body

        //validate code
        if(code == undefined){
            return res.status(404).json({
                message:"code is required"
            })
        }

        //find room
        const room  = await Room.findOne({roomId})
        if(!room){
            return res.status(400).json({
                message:"Room not found"
            })
        }
        room.code  = code;

        if(language){
            room.language = language
        }

        await room.save()

        res.status(200).json({
            message:"Code saved successfully",
            payload:room
        })
    }catch(error){
        console.log(error)

        res.status(500).json({
            message:"Server error"
        })
    }
}