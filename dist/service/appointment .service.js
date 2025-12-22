"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const appointment__query_1 = require("../repositories/appointment .query");
const shift_query_1 = require("../repositories/shift.query");
class AppointmentService {
    constructor() {
        this.appointmentQuery = new appointment__query_1.AppointmentQuery();
    }
    createAppointment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAppointment = yield this.appointmentQuery.create({
                salon: data.salon,
                service: data.service,
                user: data.user,
                staff_id: data.staff_id,
                date: data.date,
                appointment_start_time: data.appointment_start_time,
                appointment_end_time: data.appointment_end_time,
                status: data.status,
            });
            return { message: "نوبت  با موفقیت ایجاد شد", newAppointment };
        });
    }
    showUnbookedAppointments(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const shiftQuery = new shift_query_1.ShiftQuery();
            const shifts = shiftQuery.find({ salonId: data.salon, service: { $elemMatch: { service_id: data.service } } });
            let unbookedAppointments = [{}];
            if (shifts) {
                let startTime;
                let endTime;
                for (let i = 0; i < shifts.length; i++) {
                    const staffId = shifts[i].staff_id;
                    if (shifts[i].exceptionDates > 0) {
                        for (let j = 0; j < shifts[i].exceptionDates.length; j++) {
                            if (shifts[i].exceptionDates[j].date == data.date && shifts[i].exceptionDates[j].status == "cancelled") {
                                continue;
                            }
                            else if (shifts[i].exceptionDates[j].date == data.date && shifts[i].exceptionDates[j].status == "active") {
                                startTime = shifts[i].exceptionDates[j].startTime;
                                endTime = shifts[i].exceptionDates[j].endTime;
                            }
                            else {
                                startTime = shifts[i].startTime;
                                endTime = shifts[i].endTime;
                            }
                        }
                    }
                    else {
                        startTime = shifts[i].startTime;
                        endTime = shifts[i].endTime;
                    }
                    let startTime_formatted;
                    let endTime_formatted;
                    const format = function (startTime, endTime) {
                        const [startHour, startMinute] = startTime.split(":").map(Number);
                        const [endHour, endMinute] = endTime.split(":").map(Number);
                        startTime_formatted = startHour * 60 + startMinute;
                        endTime_formatted = endHour * 60 + endMinute;
                    };
                    format(startTime, endTime);
                    const duration = shifts[i].service.find((s) => s.service_id.toString() === data.service.toString()).duration;
                    const price = shifts[i].service.find((s) => s.service_id.toString() === data.service.toString()).price;
                    const duration_count = Math.floor((endTime_formatted - startTime_formatted) / duration);
                    for (let k = 0; k < duration_count; k++) {
                        const slot_startTime = startTime_formatted + (k * duration);
                        const slot_endTime = slot_startTime + duration;
                        const slot_startTime_hour = Math.floor(slot_startTime / 60);
                        const slot_startTime_minute = slot_startTime % 60;
                        const slot_endTime_hour = Math.floor(slot_endTime / 60);
                        const slot_endTime_minute = slot_endTime % 60;
                        const slot_startTime_formatted = `${slot_startTime_hour.toString().padStart(2, "0")}:${slot_startTime_minute.toString().padStart(2, "0")}`;
                        const slot_endTime_formatted = `${slot_endTime_hour.toString().padStart(2, "0")}:${slot_endTime_minute.toString().padStart(2, "0")}`;
                        const existingAppointment = yield this.appointmentQuery.findOne({
                            staff_id: staffId,
                            date: data.date,
                            appointment_start_time: slot_startTime_formatted,
                            appointment_end_time: slot_endTime_formatted,
                        });
                        if (existingAppointment) {
                            continue;
                        }
                        else {
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
                            let un = [{
                                    staff_id: staffId,
                                    date: data.date,
                                    price: price,
                                    unbookedSlots: [
                                        {
                                            startTime: "21:00",
                                            endTime: "22:00",
                                        },
                                    ],
                                    status: "unbooked",
                                }];
                            unbookedAppointments.push(un);
                        }
                    }
                }
                return { unbookedAppointments };
            }
            else {
                const error = new Error("can not find shift");
                error.statusCode = 404;
                throw error;
            }
        });
    }
}
exports.AppointmentService = AppointmentService;
