import {Model ,Document, FilterQuery ,UpdateQuery} from "mongoose";
import { BaseQuery } from "./base.query";
import{ IUser, User } from "../model/user.model";
export class UserQuery extends BaseQuery <IUser>{
    constructor(){
        super(User);
    }
    findbyPhone(phone:string):Promise<(IUser ) |null>{
        return this.findOne({phone});
    }
 }