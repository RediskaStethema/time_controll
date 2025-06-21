import {FiredEmpService} from "../../utils/tools.js";


import * as fs from "node:fs";
import {model_fire_employee, SavedFiredEmployee} from "../../model/FIred_employees.js";
import {model_tub_num, Table} from "../../model/Chekin_employees.js";



export class FiredEmpls_service implements FiredEmpService{
    async GetFiredbyID(id: string): Promise<SavedFiredEmployee> {
        const result = await model_fire_employee.findOne({id}).lean()
        return Promise.resolve(result as SavedFiredEmployee);
    }

    async GetaAllFiredEmployees(): Promise<SavedFiredEmployee[]> {
        return model_fire_employee.find().lean<SavedFiredEmployee[]>();

    }

    async GethouresOfFIredEmployees(id: string): Promise<Table[]> {
        const employee = await model_fire_employee.findOne({id}).lean<SavedFiredEmployee>()
        if (!employee) throw new Error('No employee found');
        const result=await model_tub_num.findOne({table_num:employee.tub_nume}).lean<Table[]>()
        if(!result) throw new Error('No table found');
        return result;
    }

    async DeleteEmp_From_fired(emplID: string): Promise<SavedFiredEmployee> {


        const result = await model_fire_employee.findOneAndDelete({id:emplID}).lean<SavedFiredEmployee>()
if(!result){ throw new Error('No employee found');}
await fs.promises.appendFile('./src/Deleted.log', `Deleted: ${JSON.stringify(result)}\n was deleted  on ${new Date().toISOString()}`);
        return result;
    }

}