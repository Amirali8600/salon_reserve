import { UserQuery } from "../../repositories/user.query";
import { Request,Response,NextFunction,RequestHandler   } from "express";
import { AppointmentService } from "../../service/appointment .service";
import { AppointmentQuery } from "../../repositories/appointment .query";
import { SalonQuery } from "../../repositories/salon.query";
import { Schema } from "mongoose";
export class AppointmentController{
    private appointmentService:AppointmentService=new AppointmentService();

    createAppointment:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {salon, service, user, staff_id, date, appointment_start_time, appointment_end_time, status}=req.body;
            const findappointment=await new AppointmentQuery().findOne({salon, service,staff_id,date,appointment_start_time,appointment_end_time});
            if(findappointment){
                const error:Error=new Error("این نوبت قبلا رزرو شده است");
                error.statusCode=400;
                throw error;
            }
            const newAppointment=await this.appointmentService.createAppointment({salon, service, user, staff_id, date, appointment_start_time, appointment_end_time, status});
            res.status(201).json({message:newAppointment.message,appointment:newAppointment.newAppointment});
        }   catch(error){
            next(error);
        }   
    }
}
