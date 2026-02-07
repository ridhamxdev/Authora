import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: 0 })
    rating: number;

    @Prop({ required: true, default: 0 })
    numReviews: number;

    @Prop({ required: true, default: 0 })
    price: number;

    @Prop({ required: true, default: 0 })
    countInStock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
