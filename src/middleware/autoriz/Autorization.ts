import {Role} from "../../utils/timeControlTypes.js";
import {authreq} from "../../model/Employee.js";
import {NextFunction , Response} from "express";
import {configurations} from "../../app-config/configure.js";

export const authorize = (arr: Record<string, Role[]>) =>
    (req: authreq, res: Response, next: NextFunction): void => {
        const fullPath = `${req.method} ${req.path}`;
        console.log("Checking skip:", fullPath);
        console.log( `${req.method} - first ${req.path}- thrift`)

        const roles = req.roles;

        const fullPath_2=fullPath.split("/emp/")[0] + "/"
        const allowedRoles = arr[fullPath_2];

        console.log( roles)
        console.log(allowedRoles)

        if (configurations.skipRouts.includes(fullPath_2)) {
            console.log("Skipped route by config");
            return next();
        }

        if (roles && allowedRoles?.some(role => roles.includes(role))) {
            console.log("User authorized");
            return next();
        }

        console.log("Forbidden");
        res.status(403).send("Forbidden");
    };
