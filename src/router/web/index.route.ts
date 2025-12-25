import { userRouter } from "./user.route";  
import { Router } from "express";
const router:Router=Router();
router.use("/user",userRouter);
import { appointmentRouter } from "./appointment";
router.use("/appointment",appointmentRouter);
import { salonRouter } from "./salon";
router.use("/salon",salonRouter);
export {router as webRouter};   

