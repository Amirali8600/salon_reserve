import { Router } from "express";
export const panelRouter:Router=Router();

// Here you can import and use other panel routers
import { salonRouter } from "./salon.route";
import { ownerRouter } from "./ownerroute";

panelRouter.use("/owner", ownerRouter);
panelRouter.use("/salon", salonRouter);
