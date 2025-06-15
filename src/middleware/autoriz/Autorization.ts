import {Role} from "../../utils/timeControlTypes.js";
import {authreq} from "../../model/Employee.js";
import {NextFunction , Response} from "express";
import {configurations} from "../../app-config/configure.js";

export const authorize = (arr: Record<string, Role[]>) =>
    (req: authreq, res: Response, next: NextFunction): void => {
        const fullPath = `${req.method} ${req.baseUrl}${req.path}`;  // <-- пробел между методом и путём!
        console.log("Checking skip:", fullPath);

        const roles = req.roles;
        const allowedRoles = arr[fullPath];

        if (configurations.skipRouts.includes(fullPath)) {
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
