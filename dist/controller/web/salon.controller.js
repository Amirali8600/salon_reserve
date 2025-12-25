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
exports.WebSalonService = void 0;
const salon_service_1 = require("../../service/salon.service");
class WebSalonService {
    constructor() {
        this.salonService = new salon_service_1.SalonService();
        this.GetAllsalon = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const salon = yield this.salonService.getAllSalons();
            res.json(salon);
        });
        this.GetSalonById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const salon_id = req.body.salon_id;
            const salon = yield this.salonService.getSalonById(salon_id);
            res.json(salon);
        });
    }
}
exports.WebSalonService = WebSalonService;
