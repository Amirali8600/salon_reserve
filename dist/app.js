"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_route_1 = require("./router/web/index.route");
const index_rote_1 = require("./router/panel/index.rote");
dotenv_1.default.config();
const app = (0, express_1.default)();
// express.json() can be treated as a RequestHandler to satisfy TypeScript overloads
app.use(express_1.default.json());
// register routes before the error handler
app.use("/api/", index_route_1.webRouter);
app.use("/api/panel", index_rote_1.panelRouter);
// typed error-handling middleware (must be registered after routes)
const errorHandler = (error, req, res, next) => {
    const status = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    const message = (error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error";
    res.status(status).json({ message });
};
app.use(errorHandler);
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/online_reserve_db';
mongoose_1.default.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.log(error);
});
app.listen(80, () => {
    console.log(`Server is running on port ${port}`);
});
