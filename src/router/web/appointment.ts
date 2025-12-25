import { Router } from "express";
import { AppointmentController } from "../../controller/panel/appointment .controller";
import { jwtMiddleware } from "../../midleware/jwt.midleware";
export const appointmentRouter:Router=Router();
const appointmentController:AppointmentController=new AppointmentController();
appointmentRouter.post("/create-appointment",jwtMiddleware,appointmentController.createAppointment);
appointmentRouter.post("/show-appointments",jwtMiddleware,appointmentController.showAppointment);