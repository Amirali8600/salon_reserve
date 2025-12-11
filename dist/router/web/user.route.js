"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../../controller/user.controller");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const userController = new user_controller_1.UserController();
userRouter.post("/send-otp", userController.sendOtp);
