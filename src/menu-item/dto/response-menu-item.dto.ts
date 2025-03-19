import { MenuItem } from "../schema/menu-item.schema"

export class ResponseMenuItemDto{
    success : boolean 
    message : string 
    menuItem : MenuItem | null | MenuItem[]
}