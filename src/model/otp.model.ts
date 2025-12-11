import mongoose from "mongoose";
export interface IOtp{
    _id?:string;
    phone:string;
    code:string;
    createdAt:Date;
    expiresAt:Date;
    attemptCount:number;
    status:string; // 'used', 'expired', 'active'   
}
const OtpSchema=new mongoose.Schema<IOtp>({
    phone:{type:String,required:true},
    code:{type:String,required:true},
    createdAt:{type:Date,required:true,default:Date.now},
    expiresAt:{type:Date,required:true},
    attemptCount:{type:Number,required:true,default:0},
    status:{type:String,required:true,default:"active"}, // 'verified', 'expired', 'active'   
});
export const Otp=mongoose.model("Otp",OtpSchema);
