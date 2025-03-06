import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop() 
  logoUrl: string;
  
  @Prop({ required: true }) 
  latitude: number;

  @Prop({ required: true }) 
  longitude: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'MenuItem' }] })
  menuItems: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
