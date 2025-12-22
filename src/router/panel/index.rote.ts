import { Router } from "express";
export const panelRouter:Router=Router();

// Here you can import and use other panel routers
import { salonRouter } from "./salon.route";
panelRouter.use("/salon", salonRouter);
