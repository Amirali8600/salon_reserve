import { UserQuery } from "../../repositories/user.query";
import { Request,Response,NextFunction,RequestHandler   } from "express";
import { AppointmentService } from "../../service/appointment .service";
import { AppointmentQuery } from "../../repositories/appointment .query";
import { Schema } from "mongoose";
export class AppointmentController{
    private appointmentService:AppointmentService=new AppointmentService();

    createAppointment:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {salon, service, user, shift_id, date, appointment_start_time, appointment_end_time, status}=req.body;
           
            const newAppointment=await this.appointmentService.createAppointment({salon, service, user:req.userId.userId, shift_id, date, appointment_start_time, appointment_end_time, status});
            res.status(201).json({message:newAppointment.message,appointment:newAppointment.newAppointment});
        }   catch(error){
            next(error);
        }   
    }
    showAppointment:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {salon,service,date}=req.body;
            const appointments=await this.appointmentService.showUnbookedAppointments({salon,service,date});
            res.status(200).json({appointments});
        }   catch(error){
            next(error);
        }
    }
}
