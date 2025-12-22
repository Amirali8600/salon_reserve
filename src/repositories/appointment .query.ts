import { Appointment,IAppointment } from "../model/appointment .model";
import { BaseQuery } from "./base.query";

export class AppointmentQuery extends BaseQuery<IAppointment>{
    constructor(){
        super(Appointment);
    }
}
