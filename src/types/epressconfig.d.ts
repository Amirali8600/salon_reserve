import "express-serve-static-core"
import  type  { Connection, Model, Models } from "mongoose"
declare module "express-server-static-core" {
    interface Request{
        userid?:string,
        domain?:string,
        connection?:Connection,
        model?:Models,
        
    }
}