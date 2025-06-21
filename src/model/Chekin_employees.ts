import mongoose from "mongoose";

const tabl= new mongoose.Schema({
    table_num:{type:String, required:true},
    Day:{type:String, required:true},
    time_Start:{type:String, required:true},
    time_End:{type:String, required:true},

})


export type Table={
    table_num:string,
    Day:string,
    time_Start:string,
    time_End:string
}

export const model_tub_num=mongoose.model("table_num",tabl, "collections_of_time" )
