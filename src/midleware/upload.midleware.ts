import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `image${Date.now()}.${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("فرمت فایل باید jpeg یا png باشد"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});