import {AccountingService, convertTOEmployee, getJWT} from "../../utils/tools.js";
import {
    Employee,
    EmployeeDto,
    model_EMPLOYEE,
    model_fire_employee, model_tub_num,
    SavedFiredEmployee,
    Table
} from "../../model/Employee.js";
import {Role} from "../../utils/timeControlTypes.js";
import bcrypt from "bcrypt";
import {Error} from "mongoose";


export class Account_imbd_impl implements AccountingService{


    async changePassword(empld: string, newPassword: string): Promise<void> {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(newPassword, salt)
        const Employee = await model_EMPLOYEE.findOneAndUpdate({id: empld}, {$set: {hash: hash}})
Promise.resolve(Employee)
    }

    async fireEmploye(empId: string): Promise<SavedFiredEmployee> {
        const employee = await model_EMPLOYEE.findOne({ id: empId }).lean() ;
        if (!employee) throw new Error("Employee not found");

        const fired = new model_fire_employee({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            tub_nume:employee.table_num,
            date_fired: new Date().toISOString()
        });


        await fired.save();
        await model_EMPLOYEE.deleteOne({ id: empId });

        return fired.toObject() as SavedFiredEmployee;
    }

    async getAllEmployees(): Promise<Employee[]> {
        return await model_EMPLOYEE.find().lean() as Employee[]; // lean() вернёт plain-объекты
    }

    async getEmployeebyID(id: string): Promise<Employee> {
        const employee = await model_EMPLOYEE.findOne({ id }).lean();
        if (!employee) throw new Error("Employee not found");
        return employee as Employee;
    }

    async hireEmploye(emoloyeDTO: EmployeeDto, role: Role): Promise<Employee> {

        const checking = await model_fire_employee.findOne({ id: emoloyeDTO.id  as string});
        console.log(checking)
        const cheking_exists = await model_EMPLOYEE.find({ id: emoloyeDTO.id  as string});
        console.log(cheking_exists)
        if (checking) {
           throw new Error(`This employee ${emoloyeDTO.lastName} was fired`);
        }
        if (cheking_exists.length>0) {
          throw  new Error(`This employee ${emoloyeDTO.lastName} exist`);
        }


        const employee = await convertTOEmployee(emoloyeDTO, role);

        const result = new model_EMPLOYEE(employee);
        await result.save();

        return result.toObject() as Employee;
    }

    async setRole( id: string, Role:Role): Promise<Employee> {
        const employee = await model_EMPLOYEE.findOne({ id:id });
        if (!employee) throw new Error("Employee not found");

        employee.roles = [Role];
        await employee.save();
        return employee.toObject() as Employee;
    }

    async updateEmployee( employeeDTO: EmployeeDto): Promise<Employee> {
        const employee = await model_EMPLOYEE.findOne({ id: employeeDTO.id });
        if (!employee) throw new Error("Employee not found");

        employee.firstName = employeeDTO.firstName;
        employee.lastName = employeeDTO.lastName;

        await employee.save();
        return employee.toObject() as Employee;
    }

    async Get_houres_Of_employees(Id: string): Promise<Table[]> {
        const employee = await this.getEmployeebyID(Id)
        if (!employee) throw new Error(`Employee with id ${Id} not found`);
        const arry:Table[] = await model_tub_num.find({table_num:employee.table_num})
        return Promise.resolve(arry);
    }

    async LOGIN(body:{id:string, password:string}){
    const PROFILE=await this.getEmployeebyID(body.id)
    if(!PROFILE) throw new Error(JSON.stringify({status: 404, message: `User ${body.id} not found`}))
    const passwordMATCH=bcrypt.compareSync(body.password, PROFILE.hash)
    if(!passwordMATCH) {
        throw new Error(JSON.stringify({status: 404, message: `User ${body.id} not invalid password or login`}))
    }
        const token=getJWT(body.id, PROFILE.roles)
        return Promise.resolve(token)
    }




}