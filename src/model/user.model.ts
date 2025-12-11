import mongoose from "mongoose";
export interface IUser{
    _id?:string;
    first_name:string;
    last_name:string;
    phone:string;
    password:string;
    role:string;
}
const userSchema=new mongoose.Schema<IUser>({
    first_name:{type:String,required:true,unique:true},
    last_name:{type:String,required:true,unique:true},
    phone:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,required:true,default:"user"},
},{timestamps:true}
);
export const User=mongoose.model("User",userSchema);
    