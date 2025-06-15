import {NextFunction, Request, Response} from "express";
export type Emperr={
    number: number,
    message: string
}
export const errHandl = (error:Error , req:Request, res:Response, next:NextFunction)=>{
    try {
        const err:Emperr=JSON.parse(error.message)
        res.status(err.number).end(err.message)
    }catch(e){
        res.status(500).end(`Unknown erroreSomething went wrong ${error.message}`)
    }
}