import mongoose, { Schema } from "mongoose";
export interface IService{
    _id?:Schema.Types.ObjectId;
    name:string;
}
const serviceSchema=new mongoose.Schema<IService>({
    name:{type:String,required:true},
})
export const Service=mongoose.model("Service",serviceSchema);
 