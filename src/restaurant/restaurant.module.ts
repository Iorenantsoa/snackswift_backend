import { Module, } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { MenuItemModule } from 'src/menu-item/menu-item.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }, { name: User.name, schema: UserSchema },
    ]),
    MenuItemModule , 
    CategoryModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule { }
