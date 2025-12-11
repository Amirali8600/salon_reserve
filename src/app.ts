import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {    userRouter } from "./router/web/user.route";
import { url } from "inspector";
dotenv.config();
const app = express();
// express.json() can be treated as a RequestHandler to satisfy TypeScript overloads
app.use(express.json());

// register routes before the error handler
app.use("/a", userRouter);

// typed error-handling middleware (must be registered after routes)
const errorHandler: express.ErrorRequestHandler = (error, req, res, next) => {
    const status: number = (error as any)?.statusCode || 500;
    const message: string = (error as any)?.message || "Internal Server Error";
    res.status(status).json({ message });
};

app.use(errorHandler);

    

console.log("aaaaaaaaa");

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/online_reserve_db';
mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch(error=>{console.log(error);
});
app.listen(80, () => {
    console.log(`Server is running on port ${port}`);
});