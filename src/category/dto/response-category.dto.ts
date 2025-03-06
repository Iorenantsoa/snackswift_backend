import { Category } from "../schema/category.schema"

export class ResponseCategoryDto{
    success : boolean 
    message : string 
    category : Category | null | Category[]
}