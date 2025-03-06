import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { DriverModule } from './driver/driver.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { FavoriteModule } from './favorite/favorite.module';
import { PromoCodeModule } from './promo-code/promo-code.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/snackswift_db'), UserModule, RestaurantModule, MenuItemModule, CategoryModule, OrderModule, DriverModule, PaymentModule, NotificationModule, MessageModule, FavoriteModule, PromoCodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
