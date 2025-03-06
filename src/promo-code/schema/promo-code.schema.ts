import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromoCodeDocument = HydratedDocument<PromoCode>;

@Schema({ timestamps: true })
export class PromoCode {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  discountPercentage: number;

  @Prop({ required: true })
  expiryDate: Date;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
