import { time } from "console";
import mongoose, { Schema } from "mongoose";
import { ref } from "process";
export interface IAppointment {
    salon:Schema.Types.ObjectId;
    service:Schema.Types.ObjectId;
    user:Schema.Types.ObjectId;
    shiftid:Schema.Types.ObjectId;
    date:Date;
    appointment_start_time:string;
    appointment_end_time:string;
    status:string; // booked,completed,cancelled
}
const Appointment_Schema =new mongoose.Schema<IAppointment>({
salon:{type:Schema.Types.ObjectId,ref:"Salon",required:true},
service:{type:Schema.Types.ObjectId,ref:"Service",required:true},
user:{type:Schema.Types.ObjectId,ref:"User",required:true},
date:{type:Date,required:true},
appointment_start_time:{type:String,required:true},
appointment_end_time:{type:String,required:true},
shiftid:{type:Schema.Types.ObjectId,ref:"Shift",required:true},
status:{type:String,required:true,default:"booked"}, // booked,completed,cancelled
},{timestamps:true}
);
export const Appointment=mongoose.model("Appointment",Appointment_Schema);


