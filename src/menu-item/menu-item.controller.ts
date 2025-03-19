import { Controller, Post, UseGuards, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { JwtAuthGuard } from 'src/user/guard/jwt-aut.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { User } from 'decorators/user.decorator';
import { ResponseMenuItemDto } from './dto/response-menu-item.dto';
import { NewMenuItemDto } from './dto/new-menu-items.dto';


@Controller('menu-item')
@UseGuards(JwtAuthGuard)
export class MenuItemController {

    constructor(
        private menuItemService: MenuItemService
    ) { }

    @Post('/create-menuItem')
    @Roles('admin','restaurant')
    @UseGuards(RolesGuard)
    async createMenuItem(
        @Body() newMenuItem: NewMenuItemDto,
        @User() user: any
    ): Promise<ResponseMenuItemDto> {
        return this.menuItemService.createMenuItem(newMenuItem, user)
    }

    @Get('/get-all-menuItems')
    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    async getAllMenuItems(
    ): Promise<ResponseMenuItemDto> {
        return this.menuItemService.getAllMenuItems()
    }

    @Get('/get-menuItems-dispo')
    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    async getMenuItemsItemsDispo(
    ): Promise<ResponseMenuItemDto> {
        return this.menuItemService.getMenuItemDisponible()
    }

    @Get('/get-menuItem/:id')
    @Roles('restaurant', 'admin', 'client', 'livreur')
    @UseGuards(RolesGuard)
    async getOneMenuItem(
        @Param('id') id: string
    ): Promise<ResponseMenuItemDto> {
        return this.menuItemService.getOneMenuItem(id)
    }
    @Delete('/delete-menuItem/:id')
    @Roles('restaurant', 'admin')
    @UseGuards(RolesGuard) 
    async deleteMenuItem(
        @Param('id') id: string
    ): Promise<ResponseMenuItemDto> {
        return this.menuItemService.deleteMenuItem(id)
    }

    @Patch('/toggle-disponibility/:id')
    @Roles('restaurant', 'admin')
    @UseGuards(RolesGuard)
    async toggleDisponibility(
        @Param('id') id: string , 
        @User() user: any
    ) {
        const userId = user.user.myRestaurants[0] 
        // console.log("controller"+userId)
        return this.menuItemService.toggleDisponibility(id  , userId);
    }



}
