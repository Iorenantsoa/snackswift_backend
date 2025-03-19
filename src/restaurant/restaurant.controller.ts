import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { NewRestaurantDto } from './dto/new-restaurant.dto';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';
import { JwtAuthGuard } from 'src/user/guard/jwt-aut.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';

@Controller('restaurant')
@UseGuards(JwtAuthGuard)
export class RestaurantController {

    constructor(
        private restaurantService: RestaurantService
    ) { }

    @Post('/create-restaurant')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async createRestaurant(
        @Body() newRestaurant: NewRestaurantDto
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.createRestaurant(newRestaurant)
    }


    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    @Get('/get-all-restaurants')
    async getRestaurant(
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.getRestaurant()
    }

    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    @Get('/get-restaurant/:id')
    async getOneRestaurant(
        @Param('id') id: string
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.getOneRestaurant(id)
    }


    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    @Get('/get-restaurant/:id')
    async getMenuItemsRestaurant(
        @Param('id') id: string
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.getMenuItemsRestaurant(id)
    }

    @Get('/:id/menu-items')
    async getAvailableMenuItems(@Param('id') restaurantId: string) {
        return this.restaurantService.getAvailableMenuItems(restaurantId);
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Delete('/delete-restaurant/:id')
    async deleteRestaurant(
        @Param('id') id: string
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.deleteRestaurant(id)
    }

    @Roles('restaurant', 'admin')
    @UseGuards(RolesGuard)
    @Put('/update-restaurant/:id')
    async updateRestaurant(
        @Param('id') id: string,
        @Body() updateRestaurant: NewRestaurantDto
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.updateRestaurant(id, updateRestaurant)
    }

}
