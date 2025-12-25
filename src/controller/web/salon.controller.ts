import { SalonService } from "../../service/salon.service";
import { Request,Response,NextFunction,RequestHandler   } from "express";

export class WebSalonService {
    private salonService: SalonService= new SalonService();
    GetAllsalon:RequestHandler =async (req:Request,res:Response,next:NextFunction): Promise<void> => {
       const salon = await this.salonService.getAllSalons();
       res.json(salon);
    }
    GetSalonById:RequestHandler =async (req:Request,res:Response,next:NextFunction): Promise<void> => {
        const salon_id = req.body.salon_id;
        const salon = await this.salonService.getSalonById(salon_id);
        res.json(salon);
    }
}