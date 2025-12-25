"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../../service/user.service");
const otp_service_1 = require("../../service/otp.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    constructor() {
        this.otpService = new otp_service_1.OtpService();
        this.userService = new user_service_1.UserService();
        this.sendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const {first_name,last_name,phone,password,role}=req.body;
                // const hash_password=bcrypt.hashSync(password,10);
                // const newUser=await this.userService.registerUser({first_name,last_name,phone,hash_password,role});
                // if(!newUser){
                //     const error:Error=new Error("خطایی در ثبت کاربر رخ داده است");
                //     error.statusCode=500;
                //     throw error;
                // }
                // res.status(201).json({message:"User registered successfully",user:newUser});
                // sendOtp("09026462568",["1234"]);
                const phone = req.body.phone;
                const result = yield this.otpService.generateAndSendOtp(phone);
                res.status(200).json(result.message);
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, otp } = req.body;
                const result = yield this.otpService.verifyOtp(phone, otp);
                res.status(200).json(result.message);
            }
            catch (error) {
                next(error);
            }
        });
        this.registerUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, phone, password, role } = req.body;
                const hash_password = bcrypt_1.default.hashSync(password, 10);
                const newUser = yield this.userService.registerUser({ first_name, last_name, phone, hash_password, role });
                if (!newUser) {
                    const error = new Error("خطایی در ثبت کاربر رخ داده است");
                    error.statusCode = 500;
                    throw error;
                }
                res.status(201).json({ message: newUser.message, user: newUser.newUser });
            }
            catch (error) {
                next(error);
            }
        });
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, password } = req.body;
                const result = yield this.userService.loginUser(phone, password);
                res.status(200).json({ message: result.message, token: result.token });
            }
            catch (error) {
                next(error);
            }
        });
        this.ShowUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone } = req.userId.phone;
                const result = yield this.userService.userAccount(phone);
                res.status(200).json({ message: result.message, user: result.user });
            }
            catch (error) {
                next(error);
            }
        });
        this.showUserAppointments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.userId.userId;
                const result = yield this.userService.showUserAppointments(userId);
                res.status(200).json({ message: result.message, appointments: result.appointments });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
