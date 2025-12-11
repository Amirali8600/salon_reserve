import { AppointmentQuery } from "../repositories/appointment .query";
import { IAppointment } from "../model/Appointment .model";
import { Schema } from "mongoose";
import { ShiftQuery } from "../repositories/shift.query";
export class AppointmentService {
    private appointmentQuery=new AppointmentQuery()
    async createAppointment(data:{salon:Schema.Types.ObjectId; service:Schema.Types.ObjectId; user:Schema.Types.ObjectId; staff_id:Schema.Types.ObjectId; date:Date; appointment_start_time:string; appointment_end_time:string; status:string;}):Promise<any>{
        const newAppointment=await this.appointmentQuery.create({
            salon:data.salon,
            service:data.service,   
            user:data.user,
            staff_id:data.staff_id,
            date:data.date,
            appointment_start_time:data.appointment_start_time,
            appointment_end_time:data.appointment_end_time,
            status:data.status,
        });
        return {message: "نوبت  با موفقیت ایجاد شد", newAppointment};
    }
    showUnbookedAppointments(data:{salon:Schema.Types.ObjectId,service:Schema.Types.ObjectId,date:Date}):Promise<any>{
     const shiftQuery=new ShiftQuery();
     const shifts:any=shiftQuery.find({salonId:data.salon,service:{$elemMatch:{service_id:data.service}}});
     let unbookedAppointments:[{
        staff_id:Schema.Types.ObjectId;
        date:Date;
        unbookedSlots:[ 
        {   startTime:string; 
            endTime:string;
        }];
        status:string;
     }];
     for(let i=0;i<shifts.length;i++){
        const shift=shifts[i];
        let shift_startTime:string
        let shift_endTime:string
        if(shift.exceptionDates){
            if(shift.exceptionDates.length>0){
            const findShift=await shiftQuery.findOne({_id:shift._id});
            for(let j=0;j<findShift.exceptionDates.length;j++){
                if(findShift.exceptionDates[j].date.toDateString()===data.date.toDateString()){
                    if(findShift.exceptionDates[j].status==="cancelled"){
                     unbookedAppointments.push({
                        staff_id:shift.staff_id,
                        date:data.date,
                        unbookedSlots:null,
                        status:"cancelled",
                     });
                     continue;
                    }
                    else{
                        shift_startTime=findShift.exceptionDates[j].startTime;
                        shift_endTime=findShift.exceptionDates[j].endTime;
                    }
                }
                else{
                    shift_startTime=shift.startTime;
                    shift_endTime=shift.endTime;
                }

            
            }

        }
        


    }
}
