"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const modelPath = path_1.default.join(__dirname);
fs_1.default.readdirSync(modelPath).forEach((file) => {
    if (file.endsWith(".model.js") || file.endsWith(".model.ts")) {
        require(path_1.default.join(modelPath, file));
    }
});
