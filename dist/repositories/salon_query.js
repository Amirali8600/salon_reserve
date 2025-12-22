"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonQuery = void 0;
const base_query_1 = require("./base.query");
const salon_model_1 = require("../model/salon.model");
class SalonQuery extends base_query_1.BaseQuery {
    constructor() {
        super(salon_model_1.Salon);
    }
    findbyPhone(phone) {
        return this.findOne({ phone });
    }
}
exports.SalonQuery = SalonQuery;
