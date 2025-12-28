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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownercontroller = void 0;
const user_query_1 = require("../../repositories/user.query");
const service_service_1 = require("../../service/service.service");
const salon_service_1 = require("../../service/salon.service");
const user_service_1 = require("../../service/user.service");
class ownercontroller {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.salonService = new salon_service_1.SalonService();
        this.serviceService = new service_service_1.ServiceService();
        this.userQuery = new user_query_1.UserQuery();
        this.addservice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.userId.role !== "owner") {
                    const error = new Error("شما دسترسی لازم را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { name } = req.body;
                const newService = yield this.serviceService.createService({ name });
                res.status(201).json({ message: "سرویس با موفقیت اضافه شد", newService });
            }
            catch (error) {
                next(error);
            }
        });
        this.getusers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.userId.role !== "owner") {
                    const error = new Error("شما دسترسی لازم را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { users } = yield this.userService.getAllUsers();
                res.status(200).json({ users });
            }
            catch (error) {
                next(error);
            }
        });
        this.getsalons = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.userId.role !== "owner") {
                    const error = new Error("شما دسترسی لازم را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { salons } = yield this.salonService.getAllSalons();
                res.status(200).json({ salons });
            }
            catch (error) {
                next(error);
            }
        });
        this.getservices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.userId.role !== "owner") {
                    const error = new Error("شما دسترسی لازم را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { services } = yield this.serviceService.getAllServices();
                res.status(200).json({ services });
            }
            catch (error) {
                next(error);
            }
        });
        this.changeUserRole = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone } = req.body;
                const user = yield this.userQuery.findbyPhone(phone);
                if (!user) {
                    const error = new Error("کاربری با این شماره تلفن یافت نشد");
                    error.statusCode = 404;
                    throw error;
                }
                const updateResult = yield this.userQuery.update({ _id: user._id }, { role: "owner" });
                res.status(200).json({ message: "نقش کاربر با موفقیت تغییر کرد", updateResult });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ownercontroller = ownercontroller;
