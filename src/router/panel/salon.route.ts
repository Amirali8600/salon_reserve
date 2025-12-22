import { SalonController } from "../../controller/panel/salon.controller";
import { Router } from "express";
import { upload } from "../../midleware/upload.midleware";
import { jwtMiddleware } from "../../midleware/jwt.midleware";
export const salonRouter:Router=Router();
const salonController:SalonController=new SalonController();
salonRouter.post("/create-salon",jwtMiddleware,upload.single("image"),salonController.createSalon);
salonRouter.post("/update-salon",jwtMiddleware,upload.single("image"),salonController.updateSalon);