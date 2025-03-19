import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schema/restaurant.schema';
import { Connection, Model } from 'mongoose';
import { NewRestaurantDto } from './dto/new-restaurant.dto';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { MenuItem, MenuItemDocument } from 'src/menu-item/schema/menu-item.schema';
import { Category, CategoryDocument } from 'src/category/schema/category.schema';

@Injectable()
export class RestaurantService {

    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: Model<RestaurantDocument>,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(MenuItem.name)
        private menuItemModel : Model<MenuItemDocument>,

        @InjectModel(Category.name)
        private categoryModel : Model<CategoryDocument>,


        @InjectConnection() private readonly connection: Connection

    ) { }

     
    async createRestaurant(newRestaurant: NewRestaurantDto): Promise<ResponseRestaurantDto> {
        const session = await this.connection.startSession(); // Démarrer une session pour garantir l'atomicité
        session.startTransaction();
    
        try {
            // Vérifier si le propriétaire existe
            const userFound = await this.userModel.findOne({ email: newRestaurant.owner }).session(session);
    
            if (!userFound) {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "Le propriétaire n'existe pas.",
                    restaurant: null,
                };
            }else if(userFound.role !="restaurant"){
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "L'utilisateur n'est pas un compte restaurant.",
                    restaurant: null,
                };
            }
            else{
                // Créer le restaurant
                const restaurant = new this.restaurantModel({
                    ...newRestaurant,
                    owner: userFound._id,
                });

                await restaurant.save({ session }); // Sauvegarder le restaurant avec la session

                // Ajouter l'ID du restaurant dans `myRestaurants` de l'utilisateur
                await this.userModel.findByIdAndUpdate(userFound._id, {
                    $push: { myRestaurants: restaurant._id },
                }, { session });

                // Valider la transaction
                await session.commitTransaction();
                session.endSession();

                return {
                    success: true,
                    message: "Restaurant ajouté avec succès et lié au propriétaire.",
                    restaurant: restaurant,
                };
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error(error);
    
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

    async getMenuItemsRestaurant(id: any): Promise<any> {
        try {
            const restaurant = await this.restaurantModel.findById(id).populate('menuItems')
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

    // async deleteRestaurant(id: any): Promise<ResponseRestaurantDto> {
    //     const session = await this.connection.startSession();
    //     session.startTransaction();
    
    //     try {
    //         const restaurantFound = await this.restaurantModel.findById(id).session(session);
    //         if (!restaurantFound) {
    //             await session.abortTransaction();
    //             return {
    //                 success: false,
    //                 message: "Restaurant non trouvé.",
    //                 restaurant: null
    //             };
    //         }
    
    //         // Supprimer l'ID du restaurant dans `myRestaurants` du propriétaire
    //         if (restaurantFound.owner) {
    //             await this.userModel.findByIdAndUpdate(restaurantFound.owner, {
    //                 $pull: { myRestaurants: restaurantFound._id }
    //             }, { session });
    //         }
    
    //         // Supprimer le restaurant
    //         const deletedRestaurant = await this.restaurantModel.findByIdAndDelete(id, { session });
            
    //         await session.commitTransaction();
    //         session.endSession();
    
    //         return {
    //             success: true,
    //             message: "Restaurant supprimé avec succès.",
    //             restaurant: deletedRestaurant
    //         };
    
    //     } catch (error) {
    //         await session.abortTransaction();
    //         session.endSession();
    //         return {
    //             success: false,
    //             message: "Une erreur s'est produite.",
    //             restaurant: null
    //         };
    //     }
    // }
    async deleteRestaurant(id: any): Promise<ResponseRestaurantDto> {
        const session = await this.connection.startSession();
        session.startTransaction();
    
        try {
            const restaurantFound = await this.restaurantModel.findById(id).session(session);
            if (!restaurantFound) {
                await session.abortTransaction();
                return {
                    success: false,
                    message: "Restaurant non trouvé.",
                    restaurant: null
                };
            }
    
            // Supprimer l'ID du restaurant dans `myRestaurants` du propriétaire
            if (restaurantFound.owner) {
                await this.userModel.findByIdAndUpdate(
                    restaurantFound.owner, 
                    { $pull: { myRestaurants: restaurantFound._id } }, 
                    { session }
                );
            }
    
            // Trouver et supprimer tous les MenuItems liés à ce restaurant
            const menuItems = await this.menuItemModel.find({ restaurant: id }).session(session);
            
            // Supprimer les menuItems des catégories
            for (const menuItem of menuItems) {
                await this.categoryModel.findByIdAndUpdate(
                    menuItem.category,
                    { $pull: { menuitems: menuItem._id } },
                    { session }
                );
            }
    
            // Supprimer tous les MenuItems liés à ce restaurant
            await this.menuItemModel.deleteMany({ restaurant: id }, { session });
    
            // Supprimer le restaurant
            const deletedRestaurant = await this.restaurantModel.findByIdAndDelete(id, { session });
    
            await session.commitTransaction();
            session.endSession();
    
            return {
                success: true,
                message: "Restaurant supprimé avec succès.",
                restaurant: deletedRestaurant
            };
    
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return {
                success: false,
                message: "Une erreur s'est produite.",
                restaurant: null
            };
        }
    }
    
    
     
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

    async getAvailableMenuItems(restaurantId: string): Promise<any> {
        try {
            const restaurant = await this.restaurantModel.findById(restaurantId).populate({
                path: 'menuItems',
                match: { disponibility: true } // Filtrer uniquement les plats disponibles
            });
    
            if (!restaurant) {
                return {
                    success: false,
                    message: "Restaurant non trouvé.",
                    menuItems: null
                };
            }
    
            return {
                success: true,
                message: "Plats disponibles récupérés avec succès.",
                menuItems: restaurant.menuItems
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Une erreur s'est produite.",
                menuItems: null
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