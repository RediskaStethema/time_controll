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


export const model_EMPLOYEE=mongoose.model("Lib_employees",empl_schema,'Employee_collections');


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
