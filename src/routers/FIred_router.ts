import express from "express";
import {Fired_controll} from "../controllers/Fired_controll.js";
import asyncHandler from "express-async-handler";
import {authreq} from "../model/Employee.js";

export const firedRouter=express.Router();
const controller= new Fired_controll()

firedRouter.get('/', asyncHandler(async(req:authreq, res) => {
    const result= await controller.Get_all_fired_Empl()
    if(!result) res.status(404).send("Not Found")
    res.status(200).send(result)

}))

firedRouter.get('/emp/:id', asyncHandler(async(req:authreq, res) => {
    const id=req.params.id as string
    if(!id) res.status(401).send(`Wrong ID: ${id}`)
    const result=await controller.get_Fired_Employees_by_ID(id)
    res.status(200).send(result)
}))

firedRouter.get(`/hours/emp/:id`, asyncHandler(async(req:authreq, res) => {
    const id=req.params.id as string
    if(!id) res.status(401).send(`Wrong ID: ${id}`) //was reamark
    const result= await controller.get_houres(id)
    if(!result) res.status(404).send("Not Found")
    res.status(200).send(result)
}))

firedRouter.delete(`/deleteEMP/emp/:id`, asyncHandler(async(req:authreq, res) => {
    const id=req.params.id as string
    if(!id) res.status(401).send(`Wrong ID: ${id}`)
    const result= await controller.Delete_employe_from_fired(id)
    if(!result) res.status(404).send("Not Found")
    res.status(200).send(result)
}))
