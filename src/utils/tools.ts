import {Employee, EmployeeDto, SavedFiredEmployee, Table} from "../model/Employee.js";
import {Role} from "./timeControlTypes.js";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {Account_imbd_impl} from "../services/AccountingService/AccountingService.js";
import {FiredEmpls_service} from "../services/service_fired_employes/firedEmpls_service.js";
import {Service_of_imd_shift} from "../services/service_shift/Service_of_imd_shift.js";

import jwt from "jsonwebtoken";
import {configurations} from "../app-config/configure.js";

export interface Config {
    PORT: number
    SOCKET:string
    skipRouts:string[],
    pathroles:Record<string, string[]>
    service_acc:Account_imbd_impl,
    service_fired:FiredEmpls_service
    service_table:Service_of_imd_shift
    jwt: {
        secret: string,
        exp: string
    }

}


export interface  AccountingService {
    hireEmploye:(emoloyee:EmployeeDto, Role:Role)=>Promise<Employee>;
    fireEmploye:(empId:string)=>Promise<SavedFiredEmployee>;
    updateEmployee:(employee:EmployeeDto)=>Promise<Employee> ;
    changePassword:(empld:string, newPassword:string)=>void;
    getEmployeebyID:(Id:string)=>Promise<Employee> ;
    getAllEmployees:()=>Promise<Employee[]>;
    setRole:( id: string, Role:Role)=>Promise<Employee>;
    Get_houres_Of_employees:(Id:string)=>Promise<Table[]>;
    LOGIN:(body:{id:string, password:string})=>Promise<string>;
}


export interface FiredEmpService {
    GetaAllFiredEmployees():Promise<SavedFiredEmployee[]>;
    GetFiredbyID(Id:string):Promise<SavedFiredEmployee>;
    GethouresOfFIredEmployees(id:string):Promise<Table[]>;
    DeleteEmp_From_fired(emplID:string):Promise<SavedFiredEmployee>;
}

export interface Work_Shift{
    start_of_work(id:string):Promise<boolean>;
    end_of_work(id:string):Promise<Table>;
    employ_on_salary(id:string):Promise<boolean>;
}


export const convertTOEmployee=(DTO:EmployeeDto, Role:Role):Employee=>{
    const salt=bcrypt.genSaltSync(10)
    const hash=bcrypt.hashSync(DTO.password, salt)
    return {
        firstName: DTO.firstName,
        lastName: DTO.lastName,
        id: DTO.id,
        table_num: uuidv4(),
        hash:hash,
        roles: [Role],
    }

}


export const getJWT = (id:string, roles:Role[]) => {
    const payload = {roles: JSON.stringify(roles)};
    const secretKey = configurations.jwt.secret
    const options = {
        expiresIn: configurations.jwt.exp as any,
        subject:id
    }
    const token = jwt.sign(payload, secretKey, options)
    return token;
}


