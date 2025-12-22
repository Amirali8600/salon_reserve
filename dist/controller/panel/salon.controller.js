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
exports.SalonController = void 0;
const salon_service_1 = require("../../service/salon.service");
const storagemanage_utils_1 = require("../../utils/storagemanage.utils");
const service_query_1 = require("../../repositories/service.query");
const user_query_1 = require("../../repositories/user.query");
const shift_query_1 = require("../../repositories/shift.query");
const console_1 = require("console");
class SalonController {
    constructor() {
        this.salonService = new salon_service_1.SalonService();
        this.createSalon = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.userId.role) {
                    const error = new Error("شما دسترسی لازم برای ایجاد سالن را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                console.log(req.file);
                if (!req.file) {
                    const error = new Error("تصویر سالن الزامی است");
                    error.statusCode = 400;
                    throw error;
                }
                const image = req.file.path;
                const j = '["item1", "item2", "item3"]';
                const { name, address, area, phone, rating, services_id } = req.body;
                const admin = req.userId.userId;
                const service_array = JSON.parse(services_id);
                (0, console_1.log)(service_array.length);
                let ServiceRecords = [];
                for (let i = 0; i < 3; i++) {
                    const serviceRecord = yield new service_query_1.ServiceQuery().findOne({ _id: service_array[i] });
                    (0, console_1.log)(serviceRecord);
                    if (!serviceRecord) {
                        const error = new Error("خدمات انتخاب شده معتبر نیستند");
                        error.statusCode = 400;
                        throw error;
                    }
                    ServiceRecords.push({ _id: (service_array[i]), name: serviceRecord.name });
                }
                const result = yield this.salonService.createSalon({ name, address, image, area, phone, owner: admin, rating, services: ServiceRecords
                });
                if (!result) {
                    const error = new Error("خطایی در ایجاد سالن رخ داده است");
                    error.statusCode = 500;
                    throw error;
                }
                res.status(201).json(result.message);
                const change = yield new user_query_1.UserQuery().update({ _id: admin }, { role: "admin" });
                if (!change) {
                    const error = new Error("خطایی در به روز رسانی نقش کاربر رخ داده است");
                    res.status(201).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.updateSalon = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.userId.role !== "admin") {
                    const error = new Error("شما دسترسی لازم برای این عملیات را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { salonId, name, address, area, phone, rating, services_id } = req.body;
                const findSalon = yield this.salonService.getSalonById(salonId);
                //    
                if (!findSalon) {
                    const error = new Error("سالن مورد نظر یافت نشد");
                    error.statusCode = 404;
                    throw error;
                }
                let updateData = {};
                if (name)
                    updateData.name = name;
                if (address)
                    updateData.address = address;
                if (area)
                    updateData.area = area;
                if (rating)
                    updateData.rating = rating;
                if (phone)
                    updateData.phone = phone;
                if (services_id) {
                    const service_array = JSON.parse(services_id);
                    let ServiceRecords = [];
                    for (let i = 0; i < service_array.length; i++) {
                        const serviceRecord = yield new service_query_1.ServiceQuery().findOne({ _id: service_array[i] });
                        if (!serviceRecord) {
                            const error = new Error("خدمات انتخاب شده معتبر نیستند");
                            error.statusCode = 400;
                            throw error;
                        }
                        ServiceRecords.push({ _id: (service_array[i]), name: serviceRecord.name });
                    }
                    updateData.services = ServiceRecords;
                }
                if (req.file) {
                    const imagePath = req.file.path;
                    updateData.image = imagePath;
                    if (findSalon.image !== imagePath) {
                        yield storagemanage_utils_1.StorageManageUtils.deleteFile(findSalon.image);
                    }
                }
                const result = yield this.salonService.updateSalon(salonId, updateData);
                res.status(200).json(result.message);
                if (!result) {
                    const error = new Error("خطایی در به روز رسانی سالن رخ داده است");
                    error.statusCode = 500;
                    throw error;
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.addStaff = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user.role !== "admin") {
                    const error = new Error("شما دسترسی لازم برای این عملیات را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { salonId, staff_id, startTime, endTime, service, exceptionDates } = req.body;
                const findSalon = yield this.salonService.getSalonById(salonId);
                if (!findSalon) {
                    const error = new Error("سالن مورد نظر یافت نشد");
                    error.statusCode = 404;
                    throw error;
                }
                let serviceDetails;
                for (let i = 0; i < service.length; i++) {
                    const serviceRecord = yield new service_query_1.ServiceQuery().findOne({ _id: service[i].service_id });
                    if (!serviceRecord) {
                        const error = new Error("خدمات انتخاب شده معتبر نیستند");
                        error.statusCode = 400;
                        throw error;
                    }
                    serviceDetails.push({ service_id: serviceRecord._id, duration: service[i].duration, price: service[i].price });
                }
                let exceptionDates_details;
                for (let j = 0; j < exceptionDates.length; j++) {
                    if (exceptionDates[j].date < new Date()) {
                        const error = new Error("تاریخ های استثنا نمی توانند در گذشته باشند");
                        error.statusCode = 400;
                        throw error;
                    }
                    exceptionDates_details.push({
                        date: exceptionDates[j].date,
                        startTime: exceptionDates[j].startTime,
                        endTime: exceptionDates[j].endTime,
                        status: exceptionDates[j].status,
                    });
                }
                const newShift = yield new shift_query_1.ShiftQuery().create({
                    staff_id,
                    salonId,
                    startTime,
                    endTime,
                    service: serviceDetails,
                    exceptionDates: exceptionDates_details,
                    status: "active",
                });
                if (!newShift) {
                    const error = new Error("خطایی در ایجاد شیفت رخ داده است");
                    error.statusCode = 500;
                    throw error;
                }
                const changeUserRole = yield new user_query_1.UserQuery().update({ _id: staff_id }, { role: "staff" });
                if (!changeUserRole) {
                    const error = new Error("خطایی در به روز رسانی نقش کاربر رخ داده است");
                    error.statusCode = 500;
                    throw error;
                }
                res.status(201).json({ message: "شیفت با موفقیت ایجاد شد", newShift });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateStaffShift = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user.role !== "admin") {
                    const error = new Error("شما دسترسی لازم برای این عملیات را ندارید");
                    error.statusCode = 403;
                    throw error;
                }
                const { shiftId, updateData } = req.body;
                const findShift = yield new shift_query_1.ShiftQuery().findOne({ _id: shiftId });
                if (!findShift) {
                    const error = new Error("شیفت مورد نظر یافت نشد");
                    error.statusCode = 404;
                    throw error;
                }
                let serviceDetails;
                let exceptionDates_details;
                if (updateData.service) {
                    for (let i = 0; i < updateData.service.length; i++) {
                        const serviceRecord = yield new service_query_1.ServiceQuery().findOne({ _id: updateData.service[i].service_id });
                        if (!serviceRecord) {
                            const error = new Error("خدمات انتخاب شده معتبر نیستند");
                            error.statusCode = 400;
                            throw error;
                        }
                        serviceDetails.push({ service_id: serviceRecord._id, duration: updateData.service[i].duration, price: updateData.service[i].price });
                    }
                    updateData.service = serviceDetails;
                }
                if (updateData.exceptionDates) {
                    for (let j = 0; j < updateData.exceptionDates.length; j++) {
                        if (updateData.exceptionDates[j].date < new Date()) {
                            const error = new Error("تاریخ های استثنا نمی توانند در گذشته باشند");
                            error.statusCode = 400;
                            throw error;
                        }
                        exceptionDates_details.push({
                            date: updateData.exceptionDates[j].date,
                            startTime: updateData.exceptionDates[j].startTime,
                            endTime: updateData.exceptionDates[j].endTime,
                            status: updateData.exceptionDates[j].status,
                        });
                    }
                    updateData.exceptionDates = exceptionDates_details;
                }
                //فرمت updatedate باید باشه {startTime:...,endTime:...,service:[{
                //     service_id:..., duration:..., price:...
                // }],exceptionDates:[{date:..., startTime:..., endTime:..., status:...}]} 
                const result = yield new shift_query_1.ShiftQuery().update({ _id: shiftId }, updateData);
                if (!result) {
                    const error = new Error("شیفت مورد نظر یافت نشد");
                    error.statusCode = 404;
                    throw error;
                }
                if (updateData.staff_id !== findShift.staff_id) {
                    const changeOldStaffRole = yield new user_query_1.UserQuery().update({ _id: findShift.staff_id }, { role: "user" });
                    const changeNewStaffRole = yield new user_query_1.UserQuery().update({ _id: updateData.staff_id }, { role: "staff" });
                    if (!changeOldStaffRole || !changeNewStaffRole) {
                        const error = new Error("خطایی در به روز رسانی نقش کاربر رخ داده است");
                        error.statusCode = 500;
                        throw error;
                    }
                }
                res.status(200).json({ message: "شیفت با موفقیت به روز رسانی شد", result });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SalonController = SalonController;
