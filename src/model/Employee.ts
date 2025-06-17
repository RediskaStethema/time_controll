import mongoose from "mongoose";
import {Role} from "../utils/timeControlTypes.js";
import Joi from "joi";
import {Request} from 'express'


const empl_schema= new mongoose.Schema({
firstName: {type:String, required:true},
lastName:{type:String, required:true},
id:{type:String, required:true},
table_num:{type:String, required:true},
hash:{type:String, required:true},
 roles:{type:[String], enum:Role, required:true},
})


const firedEmpl=new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName:{type:String, required:true},
    id:{type:String, required:true},
    tub_nume:{type:String, required:true},
    date_fired:{type:String, required:true},
})

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

export type Employee = {
    firstName: string,
    lastName: string,
    id: string,
    table_num: string
    hash: string,
    roles: Role[]
}

export type EmployeeDto = {
    firstName: string,
    lastName: string,
    password: string,
    id: string
}

export type SavedFiredEmployee = {
    firstName: string,
    lastName: string,
    id: string,
    date_fired:string
    tub_nume:string,

}
export const model_EMPLOYEE=mongoose.model("Lib_employees",empl_schema,'Employee_collections');
export const model_fire_employee=mongoose.model("fired", firedEmpl, "fired_collections");
export const model_tub_num=mongoose.model("table_num",tabl, "collections_of_time" )

export const emplDTOSCHEMA=Joi.object({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    password:Joi.string().required(),
    id:Joi.string().required(),
})

export const SCHEMA_Role = Joi.object({
    Role: Joi.string().valid('crew', 'manager', 'hr', 'supervisor').required(),
});

export interface authreq extends Request {
    id?:string,
    roles?:Role[]

}

export const loginSchema = Joi.object({
    id: Joi.string().max(50).min(5).required(),
    password: Joi.string().min(8).required()

})
