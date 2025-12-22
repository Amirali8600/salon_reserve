"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftQuery = void 0;
const base_query_1 = require("./base.query");
const shift_model_1 = require("../model/shift.model");
class ShiftQuery extends base_query_1.BaseQuery {
    constructor() {
        super(shift_model_1.Shift);
    }
}
exports.ShiftQuery = ShiftQuery;
