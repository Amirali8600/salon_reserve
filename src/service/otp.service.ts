import { promises } from "dns";
import axios from "axios";
import { OtpQuery } from "../repositories/otp.query";
import { User } from "../model/user.model";
import { sendOtp } from "../utils/otp.utils";
import { error } from "console";
const OTP_API_URL=process.env.OTP_API_URL;

export class OtpService {
    private otpQuery:OtpQuery=new OtpQuery();

    async generateAndSendOtp(phone:string):Promise<any>{
       try {
         const otpCode=Math.floor(1000+Math.random()*9000).toString();
        const existingOtp=await this.otpQuery.findbyPhone(phone);
        
        if(existingOtp){
            if(existingOtp.attemptCount>=5){
                const error:Error=new Error("تعداد دفعات ارسال کد بیش از حد مجاز است لطفا بعدا تلاش کنید");
                error.statusCode=429;
                return error;
            }
           else if(existingOtp.expiresAt > new Date() && existingOtp.status==="active"){
                const error:Error=new Error("کد تایید قبلا ارسال شده است لطفا تا منقضی شدن آن صبر کنید");
                error.statusCode=400;
                throw error;
            }
            await sendOtp(phone,[otpCode]);

            existingOtp.code=otpCode;
            existingOtp.createdAt=new Date();
            existingOtp.attemptCount=existingOtp.attemptCount+1;
            existingOtp.expiresAt=new Date(Date.now()+2*60*1000);
            existingOtp.status="active";
           const updatedOtp= await this.otpQuery.update({_id:existingOtp._id},existingOtp);
           return {message:"کد تایید با موفقیت ارسال شد", updatedOtp};
        }
        else{
                    await sendOtp(phone,[otpCode]);

           const newOtp= await this.otpQuery.create({
                phone,
                code:otpCode,
                createdAt:new Date(),
                expiresAt:new Date(Date.now()+2*60*1000),
                attemptCount:1,
                status:"active",
            });
             return {message:"کد تایید با موفقیت ارسال شد", newOtp};

        }
         } catch (error) {  
              throw error;
         }
    }
    async verifyOtp(phone:string,code:string):Promise<any>{
        const existingOtp=await this.otpQuery.findbyPhone(phone);
      switch (true) {
        case !existingOtp:
            { 
                const error:Error=new Error("کد تایید یافت نشد");
                error.statusCode=404;
                throw error;
            }
        case existingOtp.code!==code:
            {
                const error:Error=new Error("کد تایید اشتباه است");
                error.statusCode=400;
                throw error;
            }
        case existingOtp.expiresAt < new Date():
            {
                const error:Error=new Error("کد تایید منقضی شده است");
                existingOtp.status="expired";
                await this.otpQuery.update({_id:existingOtp._id},existingOtp);
                error.statusCode=400;
                throw error;
            }
        case existingOtp.status==="expired":
            {
                const error:Error=new Error("کد تایید منقضی شده است");
                error.statusCode=400;
                throw error;
            }
        default:
            existingOtp.status="verified";
           const updatedOtp= await this.otpQuery.update({_id:existingOtp._id},existingOtp);
            return {message:"کد تایید با موفقیت تایید شد",otp:updatedOtp};
      }
    }
}
