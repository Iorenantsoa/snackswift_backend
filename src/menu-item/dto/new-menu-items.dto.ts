import { Category } from "src/category/schema/category.schema"; 

export class NewMenuItemDto { 
    name: string;
   
    description: string;
   
    price: number;
   
    imageUrl: string;
   
    category: Category;

    disponibility : boolean
   
    // restaurant: RestaurantDocument;
}