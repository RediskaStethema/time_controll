import {configurations} from "../app-config/configure.js";
import {Employee, EmployeeDto, SavedFiredEmployee} from "../model/Employee.js";
import {Role} from "../utils/timeControlTypes.js";

export class Employ_controller {
    private service = configurations.service_acc

    async createNEWEmployee(EmployDTO: EmployeeDto, Role: Role): Promise<Employee> {
        return await this.service.hireEmploye(EmployDTO, Role)
    }

    async DELETE_Employee(emplID: string): Promise<SavedFiredEmployee> {
        return await this.service.fireEmploye(emplID)
    }

    async GetAllEmployees() {
        return await this.service.getAllEmployees();
    }

    async getEmployeebyID(emplID: string) {
        return await this.service.getEmployeebyID(emplID);
    }

    async ChangeRole(Id: string, Role: Role) {
        return await this.service.setRole(Id, Role);
    }

    async updateEmpl(employee: EmployeeDto): Promise<Employee> {
        return this.service.updateEmployee(employee);
    }

    async changePass(empld: string, newPassword: string) {
        return await this.service.changePassword(empld, newPassword);
    }

}