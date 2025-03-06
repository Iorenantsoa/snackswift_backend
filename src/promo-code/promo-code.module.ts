import { Module } from '@nestjs/common';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCode, PromoCodeSchema } from './schema/promo-code.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoCodeSchema }])], 
  controllers: [PromoCodeController],
  providers: [PromoCodeService]
})
export class PromoCodeModule {}
