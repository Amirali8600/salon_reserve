import { SalonQuery } from "../repositories/salon_query";
import { ISalon } from "../model/salon.model";
import { Schema } from "mongoose";
export class SalonService {
    private salonQuery=new SalonQuery() 
    async createSalon(data:{name:string; address:string; image:string; area:string; phone:string;  owner:Schema.Types.ObjectId; rating:number; services:{_id:string; name:string;}[]}):Promise<any>{
        const existingSalon=await this.salonQuery.findOne({phone:data.phone});
        if(existingSalon){
            const error:Error=new Error("این سالن قبلا ثبت شده است");
            error.statusCode=400;
            throw error;
        }
        const newSalon=await this.salonQuery.create({
            name:data.name,
            address:data.address,
            area:data.area,
            image:data.image,
            phone:data.phone,

            owner:data.owner,
            rating:data.rating,
            services:data.services,
        });
        return {message: "سالن با موفقیت ایجاد شد", newSalon};
    }
  async  updateSalon(salonId:Schema.Types.ObjectId,updateData:Partial<ISalon>):Promise<any>{
        const findSalon=await this.salonQuery.findOne({_id:salonId});
        if(findSalon.phone!==updateData.phone){
        const existingSalon=await this.salonQuery.findbyPhone(updateData.phone);
        if(existingSalon){
            const error:Error=new Error("این شماره تلفن قبلا ثبت شده است");
            error.statusCode=400;
            throw error;
        }
        }
        const updateResult = await this.salonQuery.update({_id:salonId},updateData);
        return {message: "سالن با موفقیت به روز رسانی شد", updateResult};
    }
    deleteSalon(salonId:Schema.Types.ObjectId):Promise<any>{
        return this.salonQuery.delete({_id:salonId});
    }
    getSalonById(salonId:Schema.Types.ObjectId):Promise<any>{
        return this.salonQuery.findOne({_id:salonId});
    }
    getAllSalons():Promise<any>{
        return this.salonQuery.find({});
    }
        
    }
