import {MessageModel} from "../models/Message.js";
import mongoose from "mongoose";
export const getMessages=async(req,res)=>{
    try{
        //get object id of the room from the request parameters
        const {roomId}=req.params;
        //check whether the room id exists or not 
        if(!roomId){
            return res.status(400).json({
                message:"Room id is required"
            });
        }
        //validate Objectid
        if(!mongoose.Types.ObjectId.isValid(roomId)){
            return res.status(400).json({
                message:"Invalid room id"
            });
        }
        //fetch messages based on the room id and sort them in ascending order based on createdAt
        const messages=await MessageModel.find({roomId}).populate("sender").sort({createdAt:1});
        //if no messages found return empty array
        if(!messages || messages.length === 0){
            return res.status(200).json({
                message:"No messages found",
                payload:[]
            });
        }
        //send response along with the messages in the room
        res.status(200).json({
            message:"Messages fetched successfully",
            payload:messages
        });
    }catch(error){
        res.status(500).json({
            message:"Error fetching messages",
            error:error.message
        });
    }
}