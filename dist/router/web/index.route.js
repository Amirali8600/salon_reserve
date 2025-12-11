"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRouter = void 0;
const user_route_1 = require("./user.route");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.webRouter = router;
router.use("/user", user_route_1.userRouter);
