import { Router } from "express";
import { UserController } from "../../controller/web/user.controller";
import { ExpressValidator } from "express-validator";
const userRouter:Router=Router();
const userController:UserController=new UserController();
userRouter.post("/send-otp"
,userController.sendOtp);
userRouter.post("/verify-otp"
,userController.);
export {userRouter};