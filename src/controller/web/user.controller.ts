import { Request,Response,NextFunction,RequestHandler   } from "express";
import { UserService } from "../../service/user.service";
import { OtpService } from "../../service/otp.service";
import bcrypt from "bcrypt";
import { log } from "console";
export class UserController{
    private otpService:OtpService=new OtpService();
    private userService:UserService=new UserService();
     sendOtp:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            // const {first_name,last_name,phone,password,role}=req.body;
            // const hash_password=bcrypt.hashSync(password,10);
            // const newUser=await this.userService.registerUser({first_name,last_name,phone,hash_password,role});
            // if(!newUser){
            //     const error:Error=new Error("خطایی در ثبت کاربر رخ داده است");
            //     error.statusCode=500;
            //     throw error;
            // }

            // res.status(201).json({message:"User registered successfully",user:newUser});
            // sendOtp("09026462568",["1234"]);
            const phone:string=req.body.phone;
            const result=await this.otpService.generateAndSendOtp(phone);
            res.status(200).json(result.message);


        }catch(error){
            next(error);
        }
    }
    verifyOtp:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {phone,otp}=req.body;
            const result=await this.otpService.verifyOtp(phone,otp);
            res.status(200).json(result.message);
        }catch(error){
            next(error);
        }
    }
    registerUser:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {first_name,last_name,phone,password,role}=req.body;
            const hash_password=bcrypt.hashSync(password,10);
            const newUser=await this.userService.registerUser({first_name,last_name,phone,hash_password,role});
            if(!newUser){
                const error:Error=new Error("خطایی در ثبت کاربر رخ داده است");
                error.statusCode=500;
                throw error;
            }
            res.status(201).json({message:newUser.message,user:newUser.newUser});
        }catch(error){
            next(error);
        }
    }
    loginUser:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {phone,password}=req.body;
            const result=await this.userService.loginUser(phone,password);
         
            res.status(200).json({message:result.message,token:result.token});
        }catch(error){
            next(error);
        }
    }
    ShowUser:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {phone}=req.userId.phone;
            const result=await this.userService.userAccount(phone);
            res.status(200).json({message:result.message,user:result.user});
        }catch(error){
            next(error);
        }
    }
    showUserAppointments:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const {userId}=req.userId.userId;
            const result=await this.userService.showUserAppointments(userId);
            res.status(200).json({message:result.message,appointments:result.appointments});
        }catch(error){
            next(error);
        }
    }
}