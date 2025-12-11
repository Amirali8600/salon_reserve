import {Model ,Document, FilterQuery ,UpdateQuery} from "mongoose";
import { BaseQuery } from "./base.query";
import { Shift,IShift } from "../model/shift.model";
export class ShiftQuery extends BaseQuery <IShift>{
    constructor(){
        super(Shift);
    }
}