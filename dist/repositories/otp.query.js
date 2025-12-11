"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpQuery = void 0;
const base_query_1 = require("./base.query");
const otp_model_1 = require("../model/otp.model");
class OtpQuery extends base_query_1.BaseQuery {
    constructor() {
        super(otp_model_1.Otp);
    }
    findbyPhone(phone) {
        return this.findOne({ phone });
    }
}
exports.OtpQuery = OtpQuery;
