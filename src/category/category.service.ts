import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { NewCategoryDto } from './dto/new-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>
    ) { }


    async createCategory(newCategory: NewCategoryDto): Promise<ResponseCategoryDto> {

        try {
            const categoryFound = await this.categoryModel.find({ name: newCategory.name })

            if (categoryFound.length < 0) {
                return {
                    success: false,
                    message: "Cette categorie éxiste déjà.",
                    category: null
                }
            } else {
                const category = await this.categoryModel.create({ ...newCategory })
                await category.save()
                return {
                    success: true,
                    message: "Catégorie ajoutée avec succès.",
                    category: category
                }
            }


        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                category: null
            }
        }

    }

    async getCategory(): Promise<ResponseCategoryDto> {
        try {
            const category = await this.categoryModel.find()
            return {
                success: true,
                message: "Catégorie recupérée avec succès.",
                category: category
            }
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                category: null
            }
        }
    }

    async getOneCategory(id: any): Promise<ResponseCategoryDto> {
        try {
            const category = await this.categoryModel.findById(id)

            return {
                success: true,
                message: "Catégorie trouvée.",
                category: category
            }

        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                category: null
            }
        }
    }

    async deleteCategory(id: any): Promise<ResponseCategoryDto> {
        try {
            const categoryFound = await this.categoryModel.findById(id)
            if (!categoryFound) {
                return {
                    success: false,
                    message: "Catégorie non trouvée.",
                    category: null
                }
            } else {
                const category = await this.categoryModel.findByIdAndDelete(id)
                return {
                    success: true,
                    message: "Catégorie supprimée avec succès.",
                    category: category
                }
            }
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                category: null
            }
        }
    }

    async updateCategory(id : any , newCategory : NewCategoryDto) : Promise<ResponseCategoryDto>{
        try {
            const categoryFound = await this.categoryModel.findById(id)
            if (!categoryFound) {
                return {
                    success: false,
                    message: "Catégorie non trouvée.",
                    category: null
                }
            } else {
                const category = await this.categoryModel.findByIdAndUpdate(id , newCategory)
                return {
                    success: true,
                    message: "Catégorie modifiée avec succès.",
                    category: category
                }
            }
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                category: null
            }
        }
    }
}
