import { Controller, Post, Body, Param, Get, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { NewCategoryDto } from './dto/new-category.dto';
import { JwtAuthGuard } from 'src/user/guard/jwt-aut.guard';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards/roles.guard';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @Post('/create-category')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async createCategory(
        @Body() newCategory: NewCategoryDto
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.createCategory(newCategory)
    }
 

    @Get('/get-all-category')
    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    async getCategory(): Promise<ResponseCategoryDto> {
        return this.categoryService.getCategory()
    }
    @Get('/get-category/:id')
    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    async getOneCategory(
        @Param('id') id: string
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.getOneCategory(id)
    }
 

    @Get('/get-menuItem-by-category/:categoryId')
    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    async getMenuItemsByCategory(
        @Param('categoryId') id: string
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.getMenuItemsByCategory(id)
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Delete('/delete-category/:id')
    async deleteCategory(
        @Param('id') id: string
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.deleteCategory(id)
    }
    @Put('/update-category/:id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategory: NewCategoryDto
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.updateCategory(id, updateCategory)
    }
}
