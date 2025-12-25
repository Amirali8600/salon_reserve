import { AppointmentQuery } from "../repositories/appointment .query";

import { Document, Schema } from "mongoose";
import { ShiftQuery } from "../repositories/shift.query";
import { IShift } from "../model/shift.model";
import { log } from "console";
export class AppointmentService {
    private appointmentQuery=new AppointmentQuery()
    async createAppointment(data:{salon:Schema.Types.ObjectId; service:Schema.Types.ObjectId; user:Schema.Types.ObjectId; shift_id:Schema.Types.ObjectId; date:Date; appointment_start_time:string; appointment_end_time:string; status:string;}):Promise<any>{
        const findappointment=await this.appointmentQuery.findOne({date:data.date,appointment_start_time:data.appointment_start_time,appointment_end_time:data.appointment_end_time,shiftid:data.shift_id});
        if(findappointment){
            const error:Error=new Error("این نوبت قبلاً ثبت شده است");
            error.statusCode=400;
            throw error;
        }
        const newAppointment=await this.appointmentQuery.create({
            salon:data.salon,
            service:data.service,   
            user:data.user,
            shiftid:data.shift_id,
            date:data.date,
            appointment_start_time:data.appointment_start_time,
            appointment_end_time:data.appointment_end_time,
            status:data.status,
        });
        return {message: "نوبت  با موفقیت ایجاد شد", newAppointment};
    }
async showUnbookedAppointments(data:{salon:Schema.Types.ObjectId,service:Schema.Types.ObjectId,date:Date}):Promise<any>{

        const shiftQuery=new ShiftQuery();
     const shifts=await shiftQuery.find({salonId:data.salon,"service.service_id":data.service});
     console.log(shifts.toString());
       let unbookedAppointments:{
      shift_id:Schema.Types.ObjectId,
      salon_id:Schema.Types.ObjectId,
      service_id:string,
    staff_name:string,
           date:string,
        price:number,
        unbookedSlots:[ 
        {   startTime:string; 
            endTime:string;
        }],
        status:string;
     }[]=[];
     if(shifts){
        let startTime:string
        let endTime:string
        for(let i=0;i<shifts.length;i++)
            
    { 
        if(shifts[i].exceptionDates.length>0){
            console.log(1)
            for(let j=0;j<shifts[i].exceptionDates.length;j++){
                          console.log(data.date.toString(),shifts[i].exceptionDates[j].date);
                const converted_date=new Date(data.date);
                console.log();
             if(converted_date.toString()===shifts[i].exceptionDates[j].date.toString()){
                console.log(2)
                // startTime=shifts[i].exceptionDates[j].startTime;
                // endTime=shifts[i].exceptionDates[j].endTime;
                if(shifts[i].exceptionDates[j].status=="active"){
                    startTime=shifts[i].exceptionDates[j].startTime;
                    endTime=shifts[i].exceptionDates[j].endTime;
                }
                else{
                    startTime="00:00";
                    endTime="00:00";
                }

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
    const duration:number=shifts[i].service.duration;
    const price:number=shifts[i].service.price;

  const duration_count=Math.floor((endTime_formatted-startTime_formatted)/duration);

  let unbookedSlots:{startTime:string;endTime:string}[]=[];
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
        staff_name:shifts[i].staff_name,
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
       
        unbookedSlots.push({startTime:slot_startTime_formatted,endTime:slot_endTime_formatted});

}
    }
    unbookedAppointments.push({
        shift_id:shifts[i]._id,
        salon_id:shifts[i].salonId,
        service_id:shifts[i].service.service_id,
        staff_name:shifts[i].staff_name,
        date:data.date as any,
        price:price,
        unbookedSlots:unbookedSlots as any,
        status:"unbooked",
    });
  
    }
      return {unbookedAppointments};



}
   else{
            const error:Error=new Error("can not find shift")
            error.statusCode=404
            throw error
        }
}

    async showBookedAppointments(data:{salon:Schema.Types.ObjectId,service:Schema.Types.ObjectId,date:Date}):Promise<any>{
       
    

       
        


    }
    

}
