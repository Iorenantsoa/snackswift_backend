import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { NewRestaurantDto } from './dto/new-restaurant.dto';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {


    constructor(
        private restaurantService: RestaurantService
    ) { }

    @Post('/create-restaurant')
    async createRestaurant(
        @Body() newRestaurant: NewRestaurantDto
    ): Promise<ResponseRestaurantDto> {
        return this.restaurantService.createRestaurant(newRestaurant)
    }


    @Get('/get-all-restaurants')
    async getRestaurant() : Promise<ResponseRestaurantDto>{
        return this.restaurantService.getRestaurant()
    }
    @Get('/get-restaurant/:id')
    async getOneRestaurant(
        @Param('id') id: string
    ) : Promise<ResponseRestaurantDto>{
        return this.restaurantService.getOneRestaurant(id)
    }

    @Delete('/delete-restaurant/:id')

    async deleteRestaurant(
        @Param('id') id: string
    ) : Promise<ResponseRestaurantDto>{
        return this.restaurantService.deleteRestaurant(id)
    }
    @Put('/update-restaurant/:id')
    async updateRestaurant(
        @Param('id') id: string ,
        @Body() updateRestaurant : NewRestaurantDto
    ) : Promise<ResponseRestaurantDto>{
        return this.restaurantService.updateRestaurant(id , updateRestaurant)
    }

}
