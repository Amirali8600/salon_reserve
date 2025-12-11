"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const error = new Error("توکن احراز هویت ارسال نشده است");
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            const error = new Error("توکن احراز هویت معتبر نیست");
            error.statusCode = 401;
            throw error;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = { userId: decoded.userId, phone: decoded.phone, role: decoded.role };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.jwtMiddleware = jwtMiddleware;
