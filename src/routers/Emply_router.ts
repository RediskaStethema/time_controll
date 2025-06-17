import express from "express";
import {Employ_controller} from "../controllers/Employ_controller.js";
import asyncHandler from "express-async-handler"
import {authreq, emplDTOSCHEMA, EmployeeDto, loginSchema, SCHEMA_Role} from "../model/Employee.js";
import {Role} from "../utils/timeControlTypes.js";

export const employeeRouter= express.Router();
export const controller=new Employ_controller()

// создание сотрудника
employeeRouter.post(
    "/new/emp/:role",
    asyncHandler(async (req:authreq, res) => {
        const body= req.body
        const Role=req.params.role as Role
        const { error } = emplDTOSCHEMA.validate(body)
        const {error:error_ROLE}=SCHEMA_Role.validate({Role})
        if (error)  res.status(400).send({ error: error.details[0].message })
        if (error_ROLE){ res.status(400).send({ error: error_ROLE }) }
        const result = await controller.createNEWEmployee(body, Role)
        res.status(200).send({ result })
    })
)

//удаление сотрудника
employeeRouter.delete(
    "/delete/emp/:id",
    asyncHandler(async (req:authreq, res) => {
        const id = req.params.id as string
        const result = await controller.DELETE_Employee(id)
        res.status(200).send({ result })
    })
)

//  Получить всех сотрудников
employeeRouter.get(
    "/all",
    asyncHandler(async (req:authreq, res) => {
        const result = await controller.GetAllEmployees()
        res.status(200).send({ result })
    })
)

//  получить сотрудника
employeeRouter.get(
    "/byID/emp/:id",
    asyncHandler(async (req:authreq, res) => {
        const id = req.params.id
        const result = await controller.getEmployeebyID(id)
        res.status(200).send({ result })
    })
)

// Изменить роль
employeeRouter.patch(
    "/changeRole",
    asyncHandler(async (req:authreq, res) => {
       const id:string=req.body.id
        const role: Role = req.body.role
        const result = await controller.ChangeRole(id,role)
        res.status(200).send({ result })
    })
)

// обновить данные
employeeRouter.put(
    "/changenames",
    asyncHandler(async (req:authreq, res) => {
        const body: EmployeeDto = req.body
        const { error } = emplDTOSCHEMA.validate(body)
        if (error) res.status(400).send({ error: error.details[0].message })
        const result = await controller.updateEmpl( body)
        res.status(200).send({ result })
    })
)

// сменить пароль
employeeRouter.patch(
    "/change/emp/:id/:password",
    asyncHandler(async (req:authreq, res) => {
        const id = req.params.id
        console.log(id)
        const newPassword = req.params.password
        if (!newPassword)  res.status(400).send({ error: "New password is required" })
        const result = await controller.changePass(id, newPassword)
          res.status(200).send({ result })
    }))

    employeeRouter.post(
        "/login",asyncHandler(async (req:authreq, res) => {
            const body = req.body
            const{error}=loginSchema.validate(body)
            if(error)  res.status(400).send({ error: error.details[0].message })
            const result= await controller.login(body)
            res.json(result)






            }))