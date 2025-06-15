import {AccountingService} from "../../utils/tools.js";
import {NextFunction, Response} from "express";
import {configurations} from "../../app-config/configure.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
import {authreq} from "../../model/Employee.js";
const BEARER="Bearer "
dotenv.config()
export const Authent=( service:AccountingService)=>{
   return async (req:authreq, res:Response, next:NextFunction) => {
      const header=req.header("Authorization");
      if(!header)next()

      try{
          if(header?.startsWith("Bearer ")) {
              await JWTauth(header, req)
             return  next()
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
        const pathmethod = `${req.method} ${req.baseUrl}${req.path}`;
        console.log('Checking skip:', pathmethod);

        if (!skips.includes(pathmethod) && !req.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        next();
    };
