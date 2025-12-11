import {Model ,Document, FilterQuery ,UpdateQuery} from "mongoose";
import { BaseQuery } from "./base.query";
import {Otp,IOtp} from "../model/otp.model";
export class OtpQuery extends BaseQuery <IOtp>{
    constructor(){
        super(Otp);
    }
    findbyPhone(phone:string):Promise<(IOtp ) |null>{
        return this.findOne({phone});
    }
 }