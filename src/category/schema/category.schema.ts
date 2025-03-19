import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  imageUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'MenuItem' }] })
  menuitems: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
