import { UserQuery } from "../../repositories/user.query";
import { Request,Response,NextFunction,RequestHandler} from "express";
import { ServiceService } from "../../service/service.service";
import { SalonService } from "../../service/salon.service";
import { UserService } from "../../service/user.service";

export class ownercontroller{
   private userService:UserService=new UserService();
   private salonService:SalonService=new SalonService();
   private serviceService:ServiceService=new ServiceService();
   private userQuery:UserQuery=new UserQuery();
addservice:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        if(req.userId.role!=="owner"){
            const error:Error=new Error("شما دسترسی لازم را ندارید");
            error.statusCode=403;
            throw error;
        }
        const {name}=req.body;
        const newService=await this.serviceService.createService({name});
        res.status(201).json({message:"سرویس با موفقیت اضافه شد",newService});
    }catch(error){
        next(error);
    }
}
    getusers:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            if(req.userId.role!=="owner"){
                const error:Error=new Error("شما دسترسی لازم را ندارید");
                error.statusCode=403;
                throw error;
            }
            const {users}=await this.userService.getAllUsers();
            res.status(200).json({users});
        }catch(error){
            next(error);
        }
    }
    getsalons:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            if(req.userId.role!=="owner"){
                const error:Error=new Error("شما دسترسی لازم را ندارید");
                error.statusCode=403;
                throw error;
            }
            const {salons}=await this.salonService.getAllSalons();
            res.status(200).json({salons});
        }catch(error){
            next(error);
        }
    }
    getservices:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
        try{
    
            const {services}=await this.serviceService.getAllServices();
            res.status(200).json({services});
        }catch(error){
            next(error);
        }
    }
    changeUserRole:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {phone}=req.body;
            const user=await this.userQuery.findbyPhone(phone);
            if(!user){
                const error:Error=new Error("کاربری با این شماره تلفن یافت نشد");
                error.statusCode=404;
                throw error;
            }
            const updateResult=await this.userQuery.update({_id:user._id},{role:"owner"});
            res.status(200).json({message:"نقش کاربر با موفقیت تغییر کرد",updateResult});
        }catch(error){
            next(error);
        }
    }
    }

