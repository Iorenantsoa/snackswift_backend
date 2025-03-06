import { Controller, Post, Body, Param  , Get , Delete , Put} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { NewCategoryDto } from './dto/new-category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @Post('/create-category')
    async createCategory(
        @Body() newCategory: NewCategoryDto
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.createCategory(newCategory)
    }


    @Get('/get-all-category')
    async getCategory() : Promise<ResponseCategoryDto>{
        return this.categoryService.getCategory()
    }
    @Get('/get-category/:id')
    async getOneCategory(
        @Param('id') id: string
    ) : Promise<ResponseCategoryDto>{
        return this.categoryService.getOneCategory(id)
    }

    @Delete('/delete-category/:id')
    async deleteCategory(
        @Param('id') id: string
    ) : Promise<ResponseCategoryDto>{
        return this.categoryService.deleteCategory(id)
    }
    @Put('/update-category/:id')
    async updateCategory(
        @Param('id') id: string ,
        @Body() updateCategory : NewCategoryDto
    ) : Promise<ResponseCategoryDto>{
        return this.categoryService.updateCategory(id , updateCategory)
    }
}
