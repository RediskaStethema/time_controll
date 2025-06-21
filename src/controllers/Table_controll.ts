import {configurations} from "../app-config/configure.js";

export class TableControll {
    private service=configurations.service_table


    async START(id:string){
        return this.service.start_of_work(id)
    }

    async END(id:string){
        return this.service.end_of_work(id)
    }
    async SALARY_EMPLOYEE(id:string){
        return this.service.employ_on_salary(id)
    }

}