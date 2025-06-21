import mongoose from "mongoose";

const firedEmpl=new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName:{type:String, required:true},
    id:{type:String, required:true},
    tub_nume:{type:String, required:true},
    date_fired:{type:String, required:true},
})

export type SavedFiredEmployee = {
    firstName: string,
    lastName: string,
    id: string,
    date_fired:string
    tub_nume:string,

}
export const model_fire_employee=mongoose.model("fired", firedEmpl, "fired_collections");