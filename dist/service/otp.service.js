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
exports.OtpService = void 0;
const axios_1 = __importDefault(require("axios"));
const otp_query_1 = require("../repositories/otp.query");
const OTP_API_URL = process.env.OTP_API_URL;
const sendOtp = (to, args) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        to,
        args,
        bodyId: Number(process.env.bodyId)
    };
    try {
        console.log(args);
        const response = yield axios_1.default.post("https://console.melipayamak.com/api/send/shared/0bec87a729d24cb7b5f058fdf3721c91", data, { headers: {
                'Content-Type': 'application/json',
            } });
        return response.data;
    }
    catch (error) {
        throw error;
    }
});
class OtpService {
    constructor() {
        this.otpQuery = new otp_query_1.OtpQuery();
    }
    generateAndSendOtp(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
                const existingOtp = yield this.otpQuery.findbyPhone(phone);
                if (existingOtp) {
                    if (existingOtp.attemptCount >= 5) {
                        const error = new Error("تعداد دفعات ارسال کد بیش از حد مجاز است لطفا بعدا تلاش کنید");
                        error.statusCode = 429;
                        return error;
                    }
                    else if (existingOtp.expiresAt > new Date() && existingOtp.status === "active") {
                        const error = new Error("کد تایید قبلا ارسال شده است لطفا تا منقضی شدن آن صبر کنید");
                        error.statusCode = 400;
                        throw error;
                    }
                    yield sendOtp(phone, [otpCode]);
                    existingOtp.code = otpCode;
                    existingOtp.createdAt = new Date();
                    existingOtp.attemptCount = existingOtp.attemptCount + 1;
                    existingOtp.expiresAt = new Date(Date.now() + 2 * 60 * 1000);
                    existingOtp.status = "active";
                    const updatedOtp = yield this.otpQuery.update({ _id: existingOtp._id }, existingOtp);
                    return { message: "کد تایید با موفقیت ارسال شد", updatedOtp };
                }
                else {
                    yield sendOtp(phone, [otpCode]);
                    const newOtp = yield this.otpQuery.create({
                        phone,
                        code: otpCode,
                        createdAt: new Date(),
                        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
                        attemptCount: 1,
                        status: "active",
                    });
                    return { message: "کد تایید با موفقیت ارسال شد", newOtp };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyOtp(phone, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingOtp = yield this.otpQuery.findbyPhone(phone);
            switch (true) {
                case !existingOtp:
                    {
                        const error = new Error("کد تایید یافت نشد");
                        error.statusCode = 404;
                        throw error;
                    }
                case existingOtp.code !== code:
                    {
                        const error = new Error("کد تایید اشتباه است");
                        error.statusCode = 400;
                        throw error;
                    }
                case existingOtp.expiresAt < new Date():
                    {
                        const error = new Error("کد تایید منقضی شده است");
                        existingOtp.status = "expired";
                        yield this.otpQuery.update({ _id: existingOtp._id }, existingOtp);
                        error.statusCode = 400;
                        throw error;
                    }
                case existingOtp.status === "expired":
                    {
                        const error = new Error("کد تایید منقضی شده است");
                        error.statusCode = 400;
                        throw error;
                    }
                default:
                    existingOtp.status = "verified";
                    const updatedOtp = yield this.otpQuery.update({ _id: existingOtp._id }, existingOtp);
                    return { message: "کد تایید با موفقیت تایید شد", otp: updatedOtp };
            }
        });
    }
}
exports.OtpService = OtpService;
