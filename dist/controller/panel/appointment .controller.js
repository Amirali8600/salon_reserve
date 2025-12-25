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
exports.AppointmentController = void 0;
const appointment__service_1 = require("../../service/appointment .service");
class AppointmentController {
    constructor() {
        this.appointmentService = new appointment__service_1.AppointmentService();
        this.createAppointment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { salon, service, user, shift_id, date, appointment_start_time, appointment_end_time, status } = req.body;
                const newAppointment = yield this.appointmentService.createAppointment({ salon, service, user: req.userId.userId, shift_id, date, appointment_start_time, appointment_end_time, status });
                res.status(201).json({ message: newAppointment.message, appointment: newAppointment.newAppointment });
            }
            catch (error) {
                next(error);
            }
        });
        this.showAppointment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { salon, service, date } = req.body;
                const appointments = yield this.appointmentService.showUnbookedAppointments({ salon, service, date });
                res.status(200).json({ appointments });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AppointmentController = AppointmentController;
