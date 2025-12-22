"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentQuery = void 0;
const appointment__model_1 = require("../model/appointment .model");
const base_query_1 = require("./base.query");
class AppointmentQuery extends base_query_1.BaseQuery {
    constructor() {
        super(appointment__model_1.Appointment);
    }
}
exports.AppointmentQuery = AppointmentQuery;
