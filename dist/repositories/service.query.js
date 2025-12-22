"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceQuery = void 0;
const base_query_1 = require("./base.query");
const server_model_1 = require("../model/server.model");
class ServiceQuery extends base_query_1.BaseQuery {
    constructor() {
        super(server_model_1.Service);
    }
}
exports.ServiceQuery = ServiceQuery;
