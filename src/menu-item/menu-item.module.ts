import { Module } from '@nestjs/common';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { MenuItem, MenuItemSchema } from './schema/menu-item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/restaurant/schema/restaurant.schema'; 
// import { User } from 'decorators/user.decorator';
// import { UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module'; 
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema } , { name: Restaurant.name, schema: RestaurantSchema } , ]),
  UserModule, 
  CategoryModule
],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports : [MongooseModule]
})
export class MenuItemModule {}
