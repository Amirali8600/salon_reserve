"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const service_query_1 = require("../repositories/service.query");
class ServiceService {
    constructor() {
        this.serviceQuery = new service_query_1.ServiceQuery();
    }
    createService(data) {
        return this.serviceQuery.create({
            name: data.name,
        });
    }
    getAllServices() {
        return this.serviceQuery.find({});
    }
    updateService(serviceId, updateData) {
        return this.serviceQuery.update({ _id: serviceId }, updateData);
    }
}
exports.ServiceService = ServiceService;
