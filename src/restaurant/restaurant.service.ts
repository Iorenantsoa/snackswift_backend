import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schema/restaurant.schema';
import { Connection, Model } from 'mongoose';
import { NewRestaurantDto } from './dto/new-restaurant.dto';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class RestaurantService {

    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: Model<RestaurantDocument>,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectConnection() private readonly connection: Connection

    ) { }

    async createRestaurant(newRestaurant: NewRestaurantDto): Promise<ResponseRestaurantDto> {
        try {
            const userFound = await this.userModel.findOne({ email: newRestaurant.owner });

            if (!userFound) {
                return {
                    success: false,
                    message: "Le propriétaire n'existe pas.",
                    restaurant: null,
                };
            }

            const restaurant = new this.restaurantModel({
                ...newRestaurant,
                owner: userFound._id,
            });

            await restaurant.save();

            return {
                success: true,
                message: "Restaurant ajouté avec succès.",
                restaurant: restaurant,
            };

        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                restaurant: null,
            };
        }
    }



    async getRestaurant(): Promise<ResponseRestaurantDto> {
        try {
            const restaurant = await this.restaurantModel.find()
            return {
                success: true,
                message: "Restaurant recupéré avec succès.",
                restaurant: restaurant
            }
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                restaurant: null
            }
        }
    }

    async getOneRestaurant(id: any): Promise<ResponseRestaurantDto> {
        try {
            const restaurant = await this.restaurantModel.findById(id)
            if (restaurant) {
                return {
                    success: true,
                    message: "Réstaurant trouvé.",
                    restaurant: restaurant
                }
            } else {
                return {
                    success: false,
                    message: "Réstaurant non trouvée.",
                    restaurant: null
                }
            }


        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                restaurant: null
            }
        }
    }

    async deleteRestaurant(id: any): Promise<ResponseRestaurantDto> {
        try {
            const restaurantFound = await this.restaurantModel.findById(id)
            if (!restaurantFound) {
                return {
                    success: false,
                    message: "Restaurant non trouvé.",
                    restaurant: null
                }
            } else {
                const restaurant = await this.restaurantModel.findByIdAndDelete(id)
                return {
                    success: true,
                    message: "Restaurant supprimé avec succès.",
                    restaurant: restaurant
                }
            }
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                restaurant: null
            }
        }
    }
    // async updateRestaurant(id: any, newRestaurant: NewRestaurantDto): Promise<ResponseRestaurantDto> {
    //     try {
    //         const restaurantFound = await this.restaurantModel.findById(id)
    //         if (!restaurantFound) {
    //             return {
    //                 success: false,
    //                 message: "Restaurant non trouvé.",
    //                 restaurant: null
    //             }
    //         } else {
    //             const userFound = await this.userModel.findOne({ email: newRestaurant.owner });

    //             if (!userFound) {
    //                 return {
    //                     success: false,
    //                     message: "Le propriétaire n'existe pas.",
    //                     restaurant: null,
    //                 };
    //             } else {
    //                 const restaurant = await this.restaurantModel.findByIdAndUpdate(id, newRestaurant)
    //                 return {
    //                     success: true,
    //                     message: "Restaurant modifié avec succès.",
    //                     restaurant: restaurant
    //                 }
    //             } 
    //         }
    //     } catch (error) {
    //         return {
    //             success: false,
    //             message: "Une erreur s'est produite.",
    //             restaurant: null
    //         }
    //     }
    // }
    async updateRestaurant(id: any, newRestaurant: NewRestaurantDto): Promise<ResponseRestaurantDto> {
        try {
            const restaurantFound = await this.restaurantModel.findById(id);
            if (!restaurantFound) {
                return {
                    success: false,
                    message: "Restaurant non trouvé.",
                    restaurant: null
                };
            }
    
            // Convertir l'email en ObjectId
            const userFound = await this.userModel.findOne({ email: newRestaurant.owner });
            if (!userFound) {
                return {
                    success: false,
                    message: "Le propriétaire n'existe pas.",
                    restaurant: null,
                };
            }
    
            // Mettre à jour le restaurant avec l'ObjectId du propriétaire trouvé
            newRestaurant.owner = userFound._id;  // Remplace l'email par l'ObjectId
    
            // Mettre à jour le restaurant
            const restaurant = await this.restaurantModel.findByIdAndUpdate(id, newRestaurant, { new: true });
    
            return {
                success: true,
                message: "Restaurant modifié avec succès.",
                restaurant: restaurant
            };
    
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                restaurant: null
            };
        }
    }
    
}

// {
//     "name": "string",

//     "address": "string",
    
//     "phone": "string",

//     "logoUrl": "string",

//     "latitude": 12,

//     "longitude": 23,

//     "menuItems": [],

//     "owner": "cedy@gmail.com"
// }