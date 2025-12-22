import { BaseQuery } from "./base.query";
import {Salon,ISalon} from "../model/salon.model";
export class SalonQuery extends BaseQuery <ISalon>{
    constructor(){
        super(Salon);
    }
     findbyPhone(phone:string):Promise<(ISalon | null)>{
            return this.findOne({phone});
        }
}
