import {Account_imbd_impl} from "../services/AccountingService/AccountingService.js";
import dotenv from "dotenv";
import appconfs from "../../config/configiur.json" with {type:'json'}
import {FiredEmpls_service} from "../services/service_fired_employes/firedEmpls_service.js";
import {Service_of_imd_shift} from "../services/service_shift/Service_of_imd_shift.js";
import {Config} from "../utils/tools.js";


dotenv.config()
export const database=`${process.env.MONGO_DB}`;
export const  configurations:Config= {
    ...appconfs,
    service_acc: new Account_imbd_impl(),
    service_fired:new FiredEmpls_service(),
    service_table: new Service_of_imd_shift(),
    jwt:{
        secret:process.env.JWT_SECRET || "super-secret-key",
        exp:process.env.JWT_EXP || "1h",
    }
}
export const socket=`${configurations.SOCKET}${configurations.PORT}`