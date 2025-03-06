import { Restaurant } from "../schema/restaurant.schema"

export class ResponseRestaurantDto{
    success : boolean 
    message : string 
    restaurant : Restaurant | null | Restaurant[]
}