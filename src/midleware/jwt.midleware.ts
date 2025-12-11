import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
export const jwtMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader){
            const error:Error=new Error("توکن احراز هویت ارسال نشده است");
            error.statusCode=401;
            throw error;
        }
        const token=authHeader.split(" ")[1];
        if(!token){
            const error:Error=new Error("توکن احراز هویت معتبر نیست");  
            error.statusCode=401;
            throw error;
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as {userId:string;phone:string;role:string};
        req.userId={userId:decoded.userId,phone:decoded.phone,role:decoded.role};
        next();
    }
    catch(error){
        next(error);
    }
}