import { ServiceQuery } from "../repositories/service.query";
export class ServiceService {
    private serviceQuery:ServiceQuery=new ServiceQuery()
    createService(data:{name:string}):Promise<any>{
        return this.serviceQuery.create({
            name:data.name,
        });
    }
    
    getAllServices():Promise<any>{
        return this.serviceQuery.find({});
    }
    updateService(serviceId:string,updateData:Partial<{name:string}>):Promise<any>{
        return this.serviceQuery.update({_id:serviceId},updateData);
    }
}