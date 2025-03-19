import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MenuItem, MenuItemDocument } from './schema/menu-item.schema';
import mongoose, { Connection, Model } from 'mongoose';
import { NewMenuItemDto } from './dto/new-menu-items.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Restaurant, RestaurantDocument } from 'src/restaurant/schema/restaurant.schema';
import { ResponseMenuItemDto } from './dto/response-menu-item.dto';
import { Category, CategoryDocument } from 'src/category/schema/category.schema';

@Injectable()
export class MenuItemService {


    constructor(
        @InjectModel(MenuItem.name)
        private menuItemModel: Model<MenuItemDocument>,

        @InjectModel(Restaurant.name)
        private restaurantModel: Model<RestaurantDocument>,

        @InjectConnection() private readonly connection: Connection,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>
    ) { }


    async createMenuItem(newMenuItem: NewMenuItemDto, user: any): Promise<ResponseMenuItemDto> {
        const session = await this.connection.startSession();
        session.startTransaction();


        try {
            const userFound = await this.userModel.findOne({ email: user.user.email }).session(session)
            // console.log(userFound)
            if (!userFound) {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "Utilisateur non trouvé.",
                    menuItem: null,
                };
            } else if (userFound.role !== "restaurant") {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "Vous n'avez pas le droit de créer un Plat.",
                    menuItem: null,
                };
            } else if (userFound.myRestaurants.length <= 0) {
                await session.abortTransaction();
                session.endSession();
                console.log("fory")
                return {
                    success: false,
                    message: "Vous n'avez pas encore un restaurant.",
                    menuItem: null,
                };
            } else if (userFound.myRestaurants.length > 0) {

                const category = await this.categoryModel.findOne({ name: newMenuItem.category }).session(session)

                if (!category) {
                    await session.abortTransaction();
                    session.endSession();
                    return {
                        success: false,
                        message: "Catégorie non trouvée",
                        menuItem: null,
                    };
                }

                const menuItem = new this.menuItemModel({
                    ...newMenuItem,
                    restaurant: userFound.myRestaurants[0],
                    category: category._id
                })
                await menuItem.save({ session })

                await this.restaurantModel.findByIdAndUpdate(userFound.myRestaurants[0]._id, {
                    $push: { menuItems: menuItem._id },
                }, { session });

                await this.categoryModel.findByIdAndUpdate(category._id, {
                    $push: { menuitems: menuItem._id }
                }, { session })

                await session.commitTransaction();
                session.endSession();

                return {
                    success: true,
                    message: "Plat ajouté avec succès .",
                    menuItem: menuItem,
                };
            }

        } catch (error) {
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }

    async getAllMenuItems(): Promise<ResponseMenuItemDto> {
        try {
            const menuItems = await this.menuItemModel.find()

            return {
                success: true,
                message: "Tous les plats",
                menuItem: menuItems,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }

    async getOneMenuItem(menuItemId: any): Promise<ResponseMenuItemDto> {

        try {
            if (!menuItemId || !mongoose.Types.ObjectId.isValid(menuItemId)) {
                return {
                    success: false,
                    message: "Menu non trouvé",
                    menuItem: null,
                };
            }
            const menuItem = await this.menuItemModel.findById(menuItemId)



            return {
                success: true,
                message: "Plat récupéré avec succès",
                menuItem: menuItem,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }

    async deleteMenuItem(menuItemId: any): Promise<ResponseMenuItemDto> {
        const session = await this.connection.startSession()
        session.startTransaction()
        try {
            if (!menuItemId || !mongoose.Types.ObjectId.isValid(menuItemId)) {
                await session.abortTransaction();
                session.endSession();

                return {
                    success: false,
                    message: "Menu non trouvé",
                    menuItem: null,
                };
            }

            const menuItem = await this.menuItemModel.findByIdAndDelete(menuItemId, { session })

            if (!menuItem) {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "Une erreur s'est produite",
                    menuItem: null,
                };
            }

            await this.categoryModel.findByIdAndUpdate(menuItem.category, {
                $pull: { menuitems: menuItem._id }
            }, { session, new: true })

            await this.restaurantModel.findByIdAndUpdate(menuItem.restaurant, {
                $pull: { menuitems: menuItem._id }
            }, { session, new: true })

            await session.commitTransaction();
            session.endSession();

            return {
                success: true,
                message: "Suppression effectuée avec success",
                menuItem: menuItem,
            };

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }

    async updateMenuItem(menuItemId: any, updatedData: Partial<NewMenuItemDto>): Promise<ResponseMenuItemDto> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            if (!menuItemId || !mongoose.Types.ObjectId.isValid(menuItemId)) {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "Menu non trouvé",
                    menuItem: null,
                };
            }

            const menuItem = await this.menuItemModel.findById(menuItemId).session(session);
            if (!menuItem) {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    message: "Menu introuvable",
                    menuItem: null,
                };
            }

            // Si la catégorie change, mettre à jour les références
            if (updatedData.category) {
                const newCategory = await this.categoryModel.findOne({ name: updatedData.category }).session(session);
                if (!newCategory) {
                    await session.abortTransaction();
                    session.endSession();
                    return {
                        success: false,
                        message: "Nouvelle catégorie non trouvée",
                        menuItem: null,
                    };
                }

                await this.categoryModel.findByIdAndUpdate(menuItem.category, {
                    $pull: { menuItems: menuItem._id }
                }, { session });

                await this.categoryModel.findByIdAndUpdate(newCategory._id, {
                    $push: { menuItems: menuItem._id }
                }, { session });

                menuItem.category = newCategory._id;
            }

            // Mettre à jour les autres champs
            Object.assign(menuItem, updatedData);
            await menuItem.save({ session });

            await session.commitTransaction();
            session.endSession();
            return {
                success: true,
                message: "Menu mis à jour avec succès",
                menuItem: menuItem,
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }
    async getMenuItemDisponible(): Promise<ResponseMenuItemDto> {
        try {
            const menuItems = await this.menuItemModel.find({ disponibility: true })

            if (menuItems.length === 0) {
                return {
                    success: false,
                    message: "Aucun plat disponible pour le moment.",
                    menuItem: [],
                };
            }
            return {
                success: true,
                message: "Tous les plats",
                menuItem: menuItems,
            };
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite",
                menuItem: null,
            };
        }
    }


    async toggleDisponibility(id: string, restaurantId: any): Promise<ResponseMenuItemDto> {
        try {
            const menuItem = await this.menuItemModel.findById(id).populate('restaurant');

            if (!menuItem) {
                return {
                    success: false,
                    message: "Plat non trouvé",
                    menuItem: null,
                };
            }

            if (!menuItem.restaurant) {
                return {
                    success: false,
                    message: "Aucun restaurant associé à ce plat.",
                    menuItem: null,
                };
            }
            console.log("menuitem.restaurant._id = " + typeof (menuItem.restaurant._id.toString()))
            console.log("restaurant id = " + typeof (restaurantId.toString()))
            // console.log("menuitem = " + menuItem)



            // Vérifie que le restaurant est bien le propriétaire du menuItem
            if (menuItem.restaurant._id.toString() !== restaurantId.toString()) {
                return {
                    success: false,
                    message: "Vous n'avez pas l'autorisation de modifier cet élément.",
                    menuItem: null,
                };
            }
            menuItem.disponibility = !menuItem.disponibility;
            await menuItem.save();
            return {
                success: true,
                message: "Changement effectué",
                menuItem: menuItem,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }

    }


    async toggleToFavorite(menuItemId: any, userId: any): Promise<ResponseMenuItemDto> {
        try {
            const menuItem = await this.menuItemModel.findById(menuItemId);

            if (!menuItem) {
                return {
                    success: false,
                    message: "Element non trouvé",
                    menuItem: null,
                };
            }

            const user = await this.userModel.findById(userId);

            if (!user) {
                return {
                    success: false,
                    message: "Utilisateur n'existe pas",
                    menuItem: null,
                };
            }

            const menuItemFound = user.myFavoriteMenuItem.find(menuItemIdFound =>
                menuItemIdFound.equals(menuItemId)
            );


            if (menuItemFound) {
                await this.userModel.findByIdAndUpdate(userId, {
                    $pull: { myFavoriteMenuItem: menuItemId }
                });
                return {
                    success: true,
                    message: "Element enlevé des favoris",
                    menuItem: menuItem,
                };
            } else {
                await this.userModel.findByIdAndUpdate(userId, {
                    $push: { myFavoriteMenuItem: menuItemId }
                });
                return {
                    success: true,
                    message: "Element ajouté aux favoris",
                    menuItem: menuItem,
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }

    // async getMyFavoriteMenuItems(userId: any): Promise<ResponseMenuItemDto> {
    //     try {
    //         const user = await this.userModel.findById(userId).populate('myFavoriteMenuItem')
    //         console.log(user)
    //     } catch (error) {
    //         return {
    //             success: false,
    //             message: error.message,
    //             menuItem: null,
    //         };
    //     }
    // }
    async getFavoriteMenuItems(userId: any): Promise<ResponseMenuItemDto> {
        try {
            const user = await this.userModel.findById(userId).populate('myFavoriteMenuItem');

            console.log(user)
            if (!user) {
                return {
                    success: false,
                    message: "Utilisateur non trouvé",
                    menuItem: null,
                };
            }

            return {
                success: true,
                message: "Favoris récupérés avec succès",
                menuItem: user.myFavoriteMenuItem, // Retourne les favoris avec leurs détails
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                menuItem: null,
            };
        }
    }


}
