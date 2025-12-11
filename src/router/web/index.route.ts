import { userRouter } from "./user.route";  
import { Router } from "express";
const router:Router=Router();
router.use("/user",userRouter);
export {router as webRouter};   

