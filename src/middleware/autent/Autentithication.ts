import {AccountingService} from "../../utils/tools.js";
import {NextFunction, Response} from "express";
import {configurations} from "../../app-config/configure.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
import {authreq} from "../../model/Employee.js";
import bcrypt from "bcrypt";
import {Role} from "../../utils/timeControlTypes.js";
const BEARER="Bearer "
dotenv.config()
const BASIC = "Basic "
async function basicAuth(header: string, req:authreq, service:AccountingService) {

    const authToken = Buffer.from(header.substring(BASIC.length), 'base64').toString('ascii');
    console.log(authToken);
    const [id, password] = authToken.split(":")
    if(id === process.env.OWNER && password === process.env.OWNER_PASS) {
        req.id = "GOD";
        req.roles = [Role.HR];
    } else
        try {
            const account = await service.getEmployeebyID(id);
            if(bcrypt.compareSync(password,account.hash)){
                req.id =id;
                req.roles = account.roles;
                console.log("reader authenticated")
            }
        } catch (e) {
            console.log("reader not authenticated")
        }

}

export const Authent=( service:AccountingService)=>{
   return async (req:authreq, res:Response, next:NextFunction) => {
      const header=req.header("Authorization");
      if(!header)next()

      try{
          if(header?.startsWith("Bearer ")) {
              await JWTauth(header, req)
             return  next()
          }
          else if(header?.startsWith("Basic ")) {
              await basicAuth(header, req, service )
          }
          console.log( "none header wrong")
      }catch(e){
          res.status(401).json({ error: (e as Error).message });
      }
   }
}

 export async function JWTauth(header:string, req:authreq){
    const token=header.substring(BEARER.length);
    try {const payload=jwt.verify(token,configurations.jwt.secret) as JwtPayload;
        req.id=payload.sub;
        req.roles=JSON.parse(payload.roles);
        console.log("reader authenticated by JWT")

    }catch(e){
        console.log(`we have a error ${e}`)
    }
}

export const skiprouts = (skips: string[]) =>
    (req: authreq, res: Response, next: NextFunction) => {
        const pathmethod_Old = `${req.method} ${req.path}`;
        const pathmethod=pathmethod_Old.split("/emp/")[0] + "/"

        console.log('Checking skip:', pathmethod);

        if (!skips.includes(pathmethod) && !req.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        } next();
    };
