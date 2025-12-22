import { Request,Response,NextFunction,RequestHandler   } from "express";
import { SalonService } from "../../service/salon.service";
import { StorageManageUtils } from "../../utils/storagemanage.utils";
import { ServiceQuery } from "../../repositories/service.query";
import { Schema, Types } from "mongoose";
import { UserQuery } from "../../repositories/user.query";
import { ShiftQuery } from "../../repositories/shift.query";
import { log } from "console";
export class SalonController{
    private salonService:SalonService=new SalonService();
    createSalon:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            // if(!req.userId.role){
            //     const error:Error=new Error("شما دسترسی لازم برای ایجاد سالن را ندارید");
            //     error.statusCode=403;
            //     throw error;
            // }
            console.log(req.file);
            
            if(!req.file){
                const error:Error=new Error("تصویر سالن الزامی است");
                error.statusCode=400;
                throw error;
            }
         const image=req.file.path;
            
            const j='["item1", "item2", "item3"]';
            const {name, address, area, phone, rating, services_id}=req.body;
            const admin=req.userId.userId;
            const service_array=JSON.parse(services_id);

            log(service_array.length);
            let ServiceRecords: { _id: string; name: string; }[]=[] ;
            for(let i=0;i<3;i++){
                const serviceRecord=await new ServiceQuery().findOne({_id:service_array[i]});
                log(serviceRecord);
                if(!serviceRecord){
                  
                    const error:Error=new Error("خدمات انتخاب شده معتبر نیستند");
                    error.statusCode=400;
                    throw error;
                }
            
                ServiceRecords.push({_id:(service_array[i]),name:serviceRecord.name});
           
            }
        
            const result=await this.salonService.createSalon({name, address, image, area, phone, owner:admin, rating, services: ServiceRecords
            });

            if(!result){
                const error:Error=new Error("خطایی در ایجاد سالن رخ داده است");
                error.statusCode=500;
                throw error;
            }
            res.status(201).json(result.message);
            const change=await new UserQuery().update({_id:admin},{role:"admin"});
            if(!change){
                const error:Error=new Error("خطایی در به روز رسانی نقش کاربر رخ داده است");
            res.status(201).json(result);
            }

        }catch(error){
            next(error);
        }
    }
    updateSalon:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            if(req.userId.role!=="admin"){
                const error:Error=new Error("شما دسترسی لازم برای این عملیات را ندارید");
                error.statusCode=403;
                throw error;
            }
            const{salonId,name,address, area, phone, rating, services_id}=req.body;
            const findSalon=await this.salonService.getSalonById(salonId);
        //    
            if(!findSalon){
                const error:Error=new Error("سالن مورد نظر یافت نشد");
                error.statusCode=404;
                throw error;
            }
        let updateData:Partial<{name?:string; address?:string; image?:string; area?:string; phone?:string; owner?:Schema.Types.ObjectId; rating?:number; services?:{_id:string; name:string;}[]}>={};
        if(name) updateData.name=name;
        if(address) updateData.address=address;
        if(area) updateData.area=area;
        if(rating) updateData.rating=rating;
       if(phone) updateData.phone=phone;
       if(services_id){
        const service_array=JSON.parse(services_id);
        let ServiceRecords: { _id: string; name: string; }[]=[] ;
        for(let i=0;i<service_array.length;i++){
            const serviceRecord=await new ServiceQuery().findOne({_id:service_array[i]});
            if(!serviceRecord){
                const error:Error=new Error("خدمات انتخاب شده معتبر نیستند");
                error.statusCode=400;
                throw error;
            }
            ServiceRecords.push({_id:(service_array[i]),name:serviceRecord.name});
        }
        updateData.services=ServiceRecords;
       }
        if(req.file){
            const imagePath=req.file.path;
            updateData.image=imagePath;
            if(findSalon.image!==imagePath){
                await StorageManageUtils.deleteFile(findSalon.image);
            }
        }   
          

            const result=await this.salonService.updateSalon(salonId,updateData);
          
            res.status(200).json(result.message);
            if(!result){
                const error:Error=new Error("خطایی در به روز رسانی سالن رخ داده است");
                error.statusCode=500;
                throw error;
            }
        }catch(error){
            next(error);
        }
    }
    addStaff:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
        try{
            if(req.user.role!=="admin"){
                const error:Error=new Error("شما دسترسی لازم برای این عملیات را ندارید");
                error.statusCode=403;
                throw error;
            }
            const {salonId,staff_id,startTime,
endTime,service,exceptionDates
            }=req.body;

            const findSalon=await this.salonService.getSalonById(salonId);
            if(!findSalon){
                const error:Error=new Error("سالن مورد نظر یافت نشد");
                error.statusCode=404;
                throw error;
            }
            let serviceDetails:[{service_id:Schema.Types.ObjectId; duration:number; price:number;}]
            for(let i=0;i<service.length;i++){
                const serviceRecord=await new ServiceQuery().findOne({_id:service[i].service_id});
                if(!serviceRecord){
                    const error:Error=new Error("خدمات انتخاب شده معتبر نیستند");
                    error.statusCode=400;
                    throw error;
                }
                serviceDetails.push({service_id:serviceRecord._id,duration:service[i].duration,price:service[i].price});
            }
            let exceptionDates_details:[{date:Date; startTime:string; endTime:string; status:string;}] ;
            for(let j=0;j<exceptionDates.length;j++){
                if(exceptionDates[j].date<new Date()){
                    const error:Error=new Error("تاریخ های استثنا نمی توانند در گذشته باشند");
                    error.statusCode=400;
                    throw error;
                }
                exceptionDates_details.push({
                    date:exceptionDates[j].date,
                    startTime:exceptionDates[j].startTime,
                    endTime:exceptionDates[j].endTime,
                    status:exceptionDates[j].status,
                });
            }
            const newShift=await new ShiftQuery().create({
                staff_id,
                salonId,
                startTime,
                endTime,
                service:serviceDetails, 
                exceptionDates:exceptionDates_details,
                status:"active",
            });
            if(!newShift){
                const error:Error=new Error("خطایی در ایجاد شیفت رخ داده است");
                error.statusCode=500;
                throw error;
            }
            const changeUserRole=await new UserQuery().update({_id:staff_id},{role:"staff"});
            if(!changeUserRole){
                const error:Error=new Error("خطایی در به روز رسانی نقش کاربر رخ داده است");
                error.statusCode=500;
                throw error;
            }
            res.status(201).json({message:"شیفت با موفقیت ایجاد شد",newShift});
        }
        catch(error){
            next(error);
        }



}
updateStaffShift:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {
    try{
        if(req.user.role!=="admin"){
            const error:Error=new Error("شما دسترسی لازم برای این عملیات را ندارید");
            error.statusCode=403;
            throw error;
        }
        const {shiftId,updateData}=req.body;
        const findShift=await new ShiftQuery().findOne({_id:shiftId});
        if(!findShift){
            const error:Error=new Error("شیفت مورد نظر یافت نشد");  
            error.statusCode=404;
            throw error;
        }
        let serviceDetails:[{service_id:Schema.Types.ObjectId; duration:number; price:number;}]
        let exceptionDates_details:[{date:Date; startTime:Date; endTime:Date; status:string;}] ;
        if(updateData.service)
        {
            for(let i=0;i<updateData.service.length;i++){
                const serviceRecord=await new ServiceQuery().findOne({_id:updateData.service[i].service_id});
                if(!serviceRecord){
                    const error:Error=new Error("خدمات انتخاب شده معتبر نیستند");
                    error.statusCode=400;
                    throw error;
                }
                serviceDetails.push({service_id:serviceRecord._id,duration:updateData.service[i].duration,price:updateData.service[i].price});
            }
            updateData.service=serviceDetails;
        }
        if(updateData.exceptionDates){
            for(let j=0;j<updateData.exceptionDates.length;j++){
                if(updateData.exceptionDates[j].date<new Date()){
                    const error:Error=new Error("تاریخ های استثنا نمی توانند در گذشته باشند");
                    error.statusCode=400;
                    throw error;
                }
                exceptionDates_details.push({
                    date:updateData.exceptionDates[j].date,
                    startTime:updateData.exceptionDates[j].startTime,
                    endTime:updateData.exceptionDates[j].endTime,
                    status:updateData.exceptionDates[j].status,
                });
            }
            updateData.exceptionDates=exceptionDates_details;
        }   
        //فرمت updatedate باید باشه {startTime:...,endTime:...,service:[{
//     service_id:..., duration:..., price:...
        // }],exceptionDates:[{date:..., startTime:..., endTime:..., status:...}]} 
        const result=await new ShiftQuery().update({_id:shiftId},updateData);
        if(!result){
            const error:Error=new Error("شیفت مورد نظر یافت نشد");
            error.statusCode=404;
            throw error;
        }
        if(updateData.staff_id!==findShift.staff_id){
            const changeOldStaffRole=await new UserQuery().update({_id:findShift.staff_id},{role:"user"});
            const changeNewStaffRole=await new UserQuery().update({_id:updateData.staff_id},{role:"staff"});
            if(!changeOldStaffRole || !changeNewStaffRole){
                const error:Error=new Error("خطایی در به روز رسانی نقش کاربر رخ داده است");
                error.statusCode=500;
                throw error;
            }
        }
        res.status(200).json({message:"شیفت با موفقیت به روز رسانی شد", result} );
    }catch(error){
        next(error);
    }

}

}