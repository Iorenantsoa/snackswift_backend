import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MenuItemDocument } from 'src/menu-item/schema/menu-item.schema';
import { RestaurantDocument } from 'src/restaurant/schema/restaurant.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['client', 'livreur', 'admin' , 'restaurant'], default: 'client' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Driver' })
  driverInfo?: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]})
  myFavoriteMenuItem? : MenuItemDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] })
  myRestaurants? : RestaurantDocument[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Restaurant' }] })
  favoriteRestaurants?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
