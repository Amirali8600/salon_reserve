import { Router } from "express";
import { ownercontroller } from "../../controller/panel/owner.controller";
import { jwtMiddleware } from "../../midleware/jwt.midleware";
export const ownerRouter:Router=Router();
const ownerCtrl:ownercontroller=new ownercontroller();

ownerRouter.post("/addservice",jwtMiddleware,ownerCtrl.addservice);
ownerRouter.post("/getusers",jwtMiddleware,ownerCtrl.getusers);
ownerRouter.post("/getsalons",jwtMiddleware,ownerCtrl.getsalons);
ownerRouter.post("/getservices",jwtMiddleware,ownerCtrl.getservices);
ownerRouter.post("/changeUserRole",jwtMiddleware,ownerCtrl.changeUserRole);