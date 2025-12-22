import { Router } from "express";
import { UserController } from "../../controller/web/user.controller";
import { ExpressValidator } from "express-validator";
const userRouter:Router=Router();
const userController:UserController=new UserController();
userRouter.post("/send-otp"
,userController.sendOtp);
userRouter.post("/verify-otp"
,userController.verifyOtp);
userRouter.post("/register",userController.registerUser)
userRouter.post("/login",userController.loginUser)

export {userRouter};