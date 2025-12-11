import {Model ,Document, FilterQuery ,UpdateQuery} from "mongoose";
import { BaseQuery } from "./base.query";
import { Service,IService } from "../model/server.model";
export class ServiceQuery extends BaseQuery <IService>{
    constructor(){
        super(Service);
    }
}