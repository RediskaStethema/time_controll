import {Work_Shift} from "../../utils/tools.js";
import {Employee, model_EMPLOYEE, model_tub_num, Table} from "../../model/Employee.js";


export class Service_of_imd_shift implements Work_Shift{
    async end_of_work(id: string): Promise<Table> {
        const employee = await model_EMPLOYEE.findOne({id}).lean<Employee>()
        const Day = new Date().toLocaleDateString('ru-RU')//'he-IL'
        const time = new Date().toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        if (!employee) {
            throw new Error('incorrect employee id')
        }
        const result=await model_tub_num.findOneAndUpdate({table_num:employee.table_num, Day},
            {$set:{time_End:time}}, { new: true })

        if (!result)throw new Error("Employee not found");
        result.save()
        return Promise.resolve(result as unknown as Table);
    }

    async start_of_work(id: string): Promise<boolean> {
        const employee = await model_EMPLOYEE.findOne({id}).lean<Employee>()
        const time = new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        const Day=new Date().toLocaleDateString('ru-RU')//'he-IL'
        if (!employee) { throw new Error('incorrect employee id') }

        const result =await model_tub_num.create({
            table_num:employee.table_num as string,
            Day:Day as string,
            time_Start:time as string,
            time_End:' '
        })
        if (!result) throw new Error('No employee no created');
        return Promise.resolve(true);
    }

    async employ_on_salary(id: string): Promise<boolean> {

        const employee = await model_EMPLOYEE.findOne({id}).lean<Employee>()
        const Day = new Date().toLocaleDateString('ru-RU')
        if (!employee) {
            throw new Error('incorrect employee id')
        }
        const result =await model_tub_num.create({
            table_num:employee.table_num as string,
            Day,
            time_Start:'Fixed',
            time_End:'Fixed',
        })

if (!result) throw new Error('No employee no created');
        return Promise.resolve(true);
    }
}