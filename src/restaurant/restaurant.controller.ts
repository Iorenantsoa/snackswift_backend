import { Body, Controller, Delete, Get, Param, Post, Put,  UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { NewRestaurantDto } from './dto/new-restaurant.dto';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';
import { JwtAuthGuard } from 'src/user/guard/jwt-aut.guard';  
import { RolesGuard } from 'guards/roles.guard';
// import { Roles } from 'decorators/roles.decorator';

@Controller('restaurant')
@UseGuards(JwtAuthGuard)
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


    // @Roles('restaurant' , 'admin') 
    // @Get('/get-all-restaurants')
    @UseGuards(RolesGuard)
    async getRestaurant( 
    ) : Promise<ResponseRestaurantDto>{ 
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
