import { open } from "fs";
import mongoose, { Schema } from "mongoose";
export interface ISalon{
    _id?:string;
    name:string;
    address:string;
    area:string;  
   image?:string;
    phone:string;
  
    owner:Schema.Types.ObjectId;
    rating:number;
    services:[{
    _id: Schema.Types.ObjectId;
    name:string;

}];

}

    const salonSchema=new Schema<ISalon>({
    name:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    area:{type:String,required:true},
    image:{type:String},
    phone:{type:String,required:true,unique:true},
 
    owner:{type:Schema.Types.ObjectId,ref:"User",required:true},
    rating:{type:Number,default:0},
    services:[{
    _id: {type:Schema.Types.ObjectId,ref:"Service"},
    name:{type:String,required:true},

}],
});
export const Salon=mongoose.model("Salon",salonSchema);

    