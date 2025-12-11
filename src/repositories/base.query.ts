import {Model ,Document, FilterQuery ,UpdateQuery} from "mongoose";
export class BaseQuery<T>{
    constructor(protected readonly model:Model<T>){}
async findOne(filter:FilterQuery<T>):Promise<T |null>{
    return this.model.findOne(filter).exec();   
}
async find(filter:FilterQuery<T>):Promise<T[]>{
    return this.model.find(filter).exec();   
}
async create(data:Partial<T>):Promise<T>{
    return this.model.create(data);   
}
async update(filter:FilterQuery<T>,updateData:UpdateQuery<T>):Promise<T |null>{
    return this.model.findOneAndUpdate(filter, updateData, { new: true }).exec();
}
async updateMany(filter:FilterQuery<T>,updateData:UpdateQuery<T>):Promise<{modifiedCount:number}>{
    const result=await this.model.updateMany(filter,updateData).exec();
    return {modifiedCount:result.modifiedCount};
}
async delete(filter:FilterQuery<T>):Promise<T |null>{
    return this.model.findOneAndDelete(filter).exec();
}
async deleteMany(filter:FilterQuery<T>):Promise<{deletedCount?:number}>{
    return this.model.deleteMany(filter).exec();
}

}