"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.panelRouter = void 0;
const express_1 = require("express");
exports.panelRouter = (0, express_1.Router)();
// Here you can import and use other panel routers
const salon_route_1 = require("./salon.route");
exports.panelRouter.use("/salon", salon_route_1.salonRouter);
