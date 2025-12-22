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
exports.sendOtp = void 0;
const axios_1 = __importDefault(require("axios"));
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
exports.sendOtp = sendOtp;
