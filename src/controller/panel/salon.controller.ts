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
            if(req.userId.role!=="admin"){
                const error:Error=new Error("شما دسترسی لازم برای این عملیات را ندارید");
                error.statusCode=403;
                throw error;
            }
            const {salonId,staff_name,startTime,
endTime,services_id,price,duration,exceptionDates
            }=req.body;
            console.log(req.body);
            
            const findSalon=await this.salonService.getSalonById(salonId);
            if(!findSalon){
                const error:Error=new Error("سالن مورد نظر یافت نشد");
                error.statusCode=404;
                throw error;
            }
            let service_info:{service_id:string,price:number,duration:number};
            let service_id_tostring:string;
            const findservice=await new ServiceQuery().findOne({_id:services_id});
            if(!findservice){
                const error:Error=new Error("خدمات انتخاب شده معتبر نیستند");
                error.statusCode=400;
                throw error
            }
            if(findSalon.services.findIndex(s=>s._id.toString()===services_id)===-1){
                const error:Error=new Error("این خدمت در سالن ارائه نمی شود");
                error.statusCode=400;
                throw error;
            }
            service_id_tostring=findservice._id.toString();
            service_info={service_id:service_id_tostring,price:price,duration:duration};
            let exceptionDates_details:{date:Date; startTime:string; endTime:string; status:string;}[] = [];

            if(exceptionDates){
            let exceptionDates_array=JSON.parse(exceptionDates);
            for(let j=0;j<exceptionDates_array.length;j++){
                if(exceptionDates_array[j].date<new Date()){
                    const error:Error=new Error("تاریخ های استثنا نمی توانند در گذشته باشند");
                    error.statusCode=400;
                    throw error;
                }
                exceptionDates_details.push({
                    date:(exceptionDates_array[j].date),
                    startTime:(exceptionDates_array[j].startTime),
                    endTime:(exceptionDates_array[j].endTime),
                    status:(exceptionDates_array[j].status),
                });
            }
        }
        else{
            exceptionDates_details=[];
        }
            const newShift=await new ShiftQuery().create({
                staff_name,
                salonId,
                startTime,
                endTime,
                service:service_info, 
                exceptionDates: exceptionDates_details as any,
                status:"active",
            });
            if(!newShift){
                const error:Error=new Error("خطایی در ایجاد شیفت رخ داده است");
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
        if(req.userId.role!=="admin"){
            const error:Error=new Error("شما دسترسی لازم برای این عملیات را ندارید");
            error.statusCode=403;
            throw error;
        }
        const {shiftId,staff_name,startTime,
endTime,services_id,price,duration,exceptionDates,status}=req.body;
            const updateData:Partial<{
                staff_name?:string;
                service?:{service_id:string; duration:number; price:number;};
                startTime?:string;
                endTime?:string;
                exceptionDates?:{date:Date; startTime:string; endTime:string; status:string;}[];
                status?:string;
            }> = {};
            if(staff_name) updateData.staff_name = staff_name;
            if(startTime) updateData.startTime = startTime;
            if(endTime) updateData.endTime = endTime;
            if(services_id && price && duration){
                const findservice=await new ServiceQuery().findOne({_id:services_id});
                if(!findservice){
                    const error:Error=new Error("خدمات انتخاب شده معتبر نیستند");
                    error.statusCode=400;
                    throw error
                }
                updateData.service={service_id:findservice._id.toString(),duration:duration,price:price};
            }
            if(status) updateData.status=req.body.status;
        let exceptionDates_details:{date:Date; startTime:string; endTime:string; status:string;}[]=[] 
            if(exceptionDates){
               
                    for(let j=0;j<exceptionDates.length;j++){
                        if(exceptionDates[j].date<Date.now()){
                            const error:Error=new Error("تاریخ های استثنا نمی توانند در گذشته باشند");
                            error.statusCode=400;
                            throw error}
                            console.log("a");
                            
                        exceptionDates_details.push({
                    date:exceptionDates[j].date,
                    startTime:exceptionDates[j].startTime,
                    endTime:exceptionDates[j].endTime,
                    status:exceptionDates[j].status,
                });
  
                


            }
        }
            updateData.exceptionDates=exceptionDates_details;

        const findShift=await new ShiftQuery().findOne({_id:shiftId});
        if(!findShift){
            const error:Error=new Error("شیفت مورد نظر یافت نشد");  
            error.statusCode=404;
            throw error;
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
       
        res.status(200).json({message:"شیفت با موفقیت به روز رسانی شد", result} );
    }catch(error){
        console.log(error);
        
        next(error);
    }

}
ShowAppointments:RequestHandler = async (req:Request,res:Response,next:NextFunction) => {    try {
        if(req.userId.role!=="admin"){
            const error:Error=new Error("شما دسترسی لازم برای این عملیات را ندارید");
            error.statusCode=403;
            throw error;
        }
        const {salonId,serviceId,date}=req.body;
        const result=await this.salonService.ShowAppointments({salonId,serviceId,date});
        if(!result){
            const error:Error=new Error("خطایی در نمایش رزروها رخ داده است");
            error.statusCode=500;
            throw error;
        }
        if(result.length===0){
            const error:Error=new Error("رزروی یافت نشد");
            error.statusCode=404;
            throw error;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

}

