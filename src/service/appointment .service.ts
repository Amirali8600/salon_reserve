import { AppointmentQuery } from "../repositories/appointment .query";

import { Document, Schema } from "mongoose";
import { ShiftQuery } from "../repositories/shift.query";
import { IShift } from "../model/shift.model";
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
async showUnbookedAppointments(data:{salon:Schema.Types.ObjectId,service:Schema.Types.ObjectId,date:Date}):Promise<any>{

         const shiftQuery=new ShiftQuery();
     const shifts:any=shiftQuery.find({salonId:data.salon,service:{$elemMatch:{service_id:data.service}}});
     let unbookedAppointments=[{}];
     if(shifts){
        let startTime:string
        let endTime:string
        for(let i=0;i<shifts.length;i++)
            
    { 
        const staffId:Schema.Types.ObjectId=shifts[i].staff_id;
        if(shifts[i].exceptionDates>0){
            for(let j=0;j<shifts[i].exceptionDates.length;j++){
            if(shifts[i].exceptionDates[j].date==data.date&&shifts[i].exceptionDates[j].status=="cancelled" ){
                continue;


            }
            else if(shifts[i].exceptionDates[j].date==data.date&&shifts[i].exceptionDates[j].status=="active" ){
                startTime=shifts[i].exceptionDates[j].startTime;
                endTime=shifts[i].exceptionDates[j].endTime;
            }
            else{
                startTime=shifts[i].startTime;
                endTime=shifts[i].endTime

            }
    }}
    else{
            startTime=shifts[i].startTime;
            endTime=shifts[i].endTime
    }
    let startTime_formatted
    let endTime_formatted
    const format=function (startTime:string,endTime:string){
        const [startHour,startMinute]=startTime.split(":").map(Number);
        const [endHour,endMinute]=endTime.split(":").map(Number);
        startTime_formatted=startHour*60+startMinute;
        endTime_formatted=endHour*60+endMinute;
    }
    format(startTime,endTime);
    const duration:number=shifts[i].service.find((s:any)=>s.service_id.toString()===data.service.toString()).duration;
    const price:number=shifts[i].service.find((s:any)=>s.service_id.toString()===data.service.toString()).price;
  const duration_count=Math.floor((endTime_formatted-startTime_formatted)/duration);
  for(let k=0;k<duration_count;k++){
    const slot_startTime=startTime_formatted+(k*duration);
    const slot_endTime=slot_startTime+duration;
    const slot_startTime_hour=Math.floor(slot_startTime/60);
    const slot_startTime_minute=slot_startTime%60;
    const slot_endTime_hour=Math.floor(slot_endTime/60);
    const slot_endTime_minute=slot_endTime%60;
    const slot_startTime_formatted=`${slot_startTime_hour.toString().padStart(2,"0")}:${slot_startTime_minute.toString().padStart(2,"0")}`;
    const slot_endTime_formatted=`${slot_endTime_hour.toString().padStart(2,"0")}:${slot_endTime_minute.toString().padStart(2,"0")}`;
    const existingAppointment=await this.appointmentQuery.findOne({
        staff_id:staffId,
        date:data.date,
        appointment_start_time:slot_startTime_formatted,
        appointment_end_time:slot_endTime_formatted,
    });
   if(existingAppointment){
    continue;
   }
    else{
        /*
         let unbookedAppointments:[{
        staff_id:Schema.Types.ObjectId;
        date:Date;
        price:number;
        unbookedSlots:[ 
        {   startTime:string; 
            endTime:string;
        }];
        status:string;
     }]
        */
        let un=[{
            staff_id:staffId,
            date:data.date,
            price:price,
            unbookedSlots:[
                {
                    startTime:"21:00",
                    endTime:"22:00",
                },

            ],
            status:"unbooked",
        }];
        unbookedAppointments.push(un);
    }

}
    }
        return {unbookedAppointments};
     
        }
        else{
            const error:Error=new Error("can not find shift")
            error.statusCode=404
            throw error
        }

       
        


    }
}

