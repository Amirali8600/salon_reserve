"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "image/");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `image${Date.now()}.${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg") {
        cb(null, true);
    }
    else {
        cb(new Error("فرمت فایل باید jpeg یا png باشد"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
});
