import {Router} from 'express';
import { WebSalonService } from '../../controller/web/salon.controller';
const salonRouter = Router();
const webSalonService=new WebSalonService();
salonRouter.post("/show-all-salons",webSalonService.GetAllsalon);
salonRouter.post("/show-salon-by-id",webSalonService.GetSalonById);

export {salonRouter};
