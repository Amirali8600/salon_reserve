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
exports.UserService = void 0;
const user_query_1 = require("../repositories/user.query");
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_query_1 = require("../repositories/otp.query");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appointment__query_1 = require("../repositories/appointment .query");
class UserService {
    constructor() {
        this.AppointmentQuery = new appointment__query_1.AppointmentQuery();
        this.userQuery = new user_query_1.UserQuery();
    }
    registerUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userQuery.findbyPhone(data.phone);
            if (existingUser) {
                const error = new Error("این شماره تلفن قبلا ثبت شده است");
                error.statusCode = 400;
                throw error;
            }
            const OtpRecord = yield new otp_query_1.OtpQuery().findbyPhone(data.phone);
            if (!OtpRecord || OtpRecord.status !== "verified") {
                const error = new Error("شماره تلفن تایید نشده است");
                error.statusCode = 400;
                throw error;
            }
            const newUser = yield this.userQuery.create({
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                password: data.hash_password,
                role: data.role || "user",
            });
            const deleteOtp = yield new otp_query_1.OtpQuery().delete({ _id: OtpRecord._id });
            return { message: "کاربر با موفقیت ثبت شد", newUser: newUser };
        });
    }
    loginUser(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userQuery.findbyPhone(phone);
            const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
            switch (true) {
                case !existingUser:
                    {
                        const error = new Error("کاربری با این شماره تلفن یافت نشد");
                        error.statusCode = 404;
                        throw error;
                    }
                case !isPasswordValid:
                    {
                        const error = new Error("رمز عبور اشتباه است");
                        error.statusCode = 400;
                        throw error;
                    }
                default:
                    const token = jsonwebtoken_1.default.sign({ userId: existingUser._id, phone: existingUser.phone, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: "1y" });
                    return { message: "ورود با موفقیت انجام شد", token };
            }
        });
    }
    userAccount(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userQuery.findbyPhone(phone);
            if (!user) {
                const error = new Error("کاربری با این شماره تلفن یافت نشد");
                error.statusCode = 404;
                throw error;
            }
            return { user };
        });
    }
    showUserAppointments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointments = yield this.AppointmentQuery.find({ userId: userId, status: "booked" });
            if (!appointments) {
                const error = new Error("هیچ رزروی یافت نشد");
                error.statusCode = 404;
                throw error;
            }
            return { appointments };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userQuery.find({});
            return { users };
        });
    }
}
exports.UserService = UserService;
