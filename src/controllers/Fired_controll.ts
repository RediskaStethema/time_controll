import {configurations} from "../app-config/configure.js";

export class Fired_controll {
    private service=configurations.service_fired
  /*
  export interface FiredEmpService {
    GetaAllFiredEmployees():Promise<SavedFiredEmployee[]>;
    GetFiredbyID(Id:string):Promise<SavedFiredEmployee>;
    GethouresOfFIredEmployees(id:string):Promise<Table[]>;
    DeleteEmp_From_fired(emplID:string):Promise<SavedFiredEmployee>;
}
   */

    async Get_all_fired_Empl(){
        return await this.service.GetaAllFiredEmployees()
    }
    async get_Fired_Employees_by_ID(id:string){
        return this.service.GetFiredbyID(id)
    }

    async get_houres(id:string){
        return await this.service.GethouresOfFIredEmployees(id)
    }

    async Delete_employe_from_fired(emplID:string) {
        return this.service.DeleteEmp_From_fired(emplID)
    }
}