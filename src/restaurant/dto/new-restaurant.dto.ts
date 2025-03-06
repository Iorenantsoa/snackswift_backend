import { Types } from "mongoose";
import { MenuItem } from "src/menu-item/schema/menu-item.schema";

export class NewRestaurantDto {
    name: string;

    address: string;

    phone: string;

    logoUrl: string;

    latitude: number;

    longitude: number;

    menuItems: MenuItem[];

    owner: string | Types.ObjectId;
}
