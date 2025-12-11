import { UserQuery } from "../repositories/user.query";
import { Otp ,IOtp} from "../model/otp.model";
import bcrypt from "bcrypt";
import { OtpQuery } from "../repositories/otp.query";
import jwt from "jsonwebtoken";
export class UserService{
    private userQuery:UserQuery=new UserQuery();
    async registerUser(data:{first_name:string;last_name:string;phone:string;hash_password:string;role?:string}):Promise<any>{
        const existingUser=await this.userQuery.findbyPhone(data.phone);
        if(existingUser){
const error:Error=new Error("این شماره تلفن قبلا ثبت شده است");
error.statusCode=400;
throw error;
        }
        const OtpRecord=await new OtpQuery().findbyPhone(data.phone);
        if(!OtpRecord || OtpRecord.status!=="verified"){
            const error:Error=new Error("شماره تلفن تایید نشده است");
            error.statusCode=400;
            throw error;
        }
        const newUser=await this.userQuery.create({
            first_name:data.first_name,
            last_name:data.last_name,
            phone:data.phone,
            password:data.hash_password,
            role:data.role || "user",
        });
        const deleteOtp=await new OtpQuery().delete({_id:OtpRecord._id});
        return {message: "کاربر با موفقیت ثبت شد", newUser:newUser};
        
    }
    async loginUser(phone:string,password:string):Promise<any>{
        const existingUser=await this.userQuery.findbyPhone(phone);
                const isPasswordValid=await bcrypt.compare(password,existingUser.password);

        switch(true){
            
            case !existingUser:
                {
                    const error:Error=new Error("کاربری با این شماره تلفن یافت نشد");
                    error.statusCode=404;
                    throw error;
                }
            case !isPasswordValid:
                {
                    const error:Error=new Error("رمز عبور اشتباه است");
                    error.statusCode=400;
                    throw error;
                }
            default:
                const token=jwt.sign({userId:existingUser._id,phone:existingUser.phone,role:existingUser.role},process.env.JWT_SECRET as string,{expiresIn:"1y"});
                return {message: "ورود با موفقیت انجام شد", token};
        }
    }
    }