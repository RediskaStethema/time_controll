import express from "express";
import {TableControll} from "../controllers/Table_controll.js";
import asyncHandler from "express-async-handler";

export const checkRouter=express.Router();
const controller= new TableControll()


checkRouter.post('/checkIN/:id',asyncHandler(async (req,res)=>{
    const id=req.params.id as string;
    const result= await controller.START(id)
    if(!result) throw new  Error( ` problem with  ${result}`)
    res.status(200).json({result})
}) );
checkRouter.post('/checkOUT/:id',asyncHandler(async (req,res)=>{
    const id=req.params.id as string
    const result= await controller.END(id)
    if(!result) throw new  Error( `problem with  ${result}`)
    console.log(result)
    res.status(200).json(true)

}))
checkRouter.post('/fixed/:id',asyncHandler(async (req,res)=>{
    const id=req.params.id
    const result=await controller.SALARY_EMPLOYEE(id as string)
    if(!result) throw new  Error( `problem with  ${result}`)
    res.status(200).json({result})

}))


