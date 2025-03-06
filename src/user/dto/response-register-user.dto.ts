import { User } from "../schema/user.schema"

export class ResponseRegisterUser{
    success : boolean 
    message : string
    user : User | null
}