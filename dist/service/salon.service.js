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
exports.SalonService = void 0;
const salon_query_1 = require("../repositories/salon_query");
const appointment__query_1 = require("../repositories/appointment .query");
class SalonService {
    constructor() {
        this.salonQuery = new salon_query_1.SalonQuery();
        this.appointmentQuery = new appointment__query_1.AppointmentQuery();
    }
    createSalon(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSalon = yield this.salonQuery.findOne({ phone: data.phone });
            if (existingSalon) {
                const error = new Error("این سالن قبلا ثبت شده است");
                error.statusCode = 400;
                throw error;
            }
            const newSalon = yield this.salonQuery.create({
                name: data.name,
                address: data.address,
                area: data.area,
                image: data.image,
                phone: data.phone,
                owner: data.owner,
                rating: data.rating,
                services: data.services,
            });
            return { message: "سالن با موفقیت ایجاد شد", newSalon };
        });
    }
    updateSalon(salonId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const findSalon = yield this.salonQuery.findOne({ _id: salonId });
            if (findSalon.phone !== updateData.phone) {
                const existingSalon = yield this.salonQuery.findbyPhone(updateData.phone);
                if (existingSalon) {
                    const error = new Error("این شماره تلفن قبلا ثبت شده است");
                    error.statusCode = 400;
                    throw error;
                }
            }
            const updateResult = yield this.salonQuery.update({ _id: salonId }, updateData);
            return { message: "سالن با موفقیت به روز رسانی شد", updateResult };
        });
    }
    ShowAppointments(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const findSalonAppointments = yield this.appointmentQuery.find({ salon: data.salonId, service: data.serviceId, date: data.date });
            const find = findSalonAppointments.toString();
            return { message: "لیست نوبت های  تاریخ ", findSalonAppointments };
        });
    }
    deleteSalon(salonId) {
        return this.salonQuery.delete({ _id: salonId });
    }
    getSalonById(salonId) {
        return this.salonQuery.findOne({ _id: salonId });
    }
    getAllSalons() {
        return this.salonQuery.find({});
    }
}
exports.SalonService = SalonService;
