import mongoose,{Schema} from "mongoose";
export interface IShift {
    _id?: Schema.Types.ObjectId;
    staff_id: Schema.Types.ObjectId;
    salonId: Schema.Types.ObjectId;
    service:[{
        service_id:Schema.Types.ObjectId;
        duration:number; // in minutes
        price:number;
    }];
    startTime: string;
    endTime: string;
    exceptionDates:[{
        date:Date;
        startTime:string;
        endTime:string;
        status:string; // cancelled,active
    }];
    status: string; // active, cancelled,
}
const ShiftSchema=new mongoose.Schema<IShift>({
    staff_id:{type:Schema.Types.ObjectId,ref:"User",required:true},
    salonId:{type:Schema.Types.ObjectId,ref:"Salon",required:true},
    startTime:{type:String,required:true},
    endTime:{type:String,required:true},
    service:[{
        service_id:{type:Schema.Types.ObjectId,ref:"Service",required:true},
        duration:{type:Number,required:true}, // in minutes
        price:{type:Number,required:true},
    }],

    exceptionDates:[{   
        date:{type:Date,required:true},
        startTime:{type:String,required:true},
        endTime:{type:String,required:true},
        
        status:{type:String,required:true,default:"active"}, // cancelled,active
    }],
    status:{type:String,required:true,default:"active"}, // active, cancelled,
},{timestamps:true});
export const Shift=mongoose.model("Shift",ShiftSchema);
