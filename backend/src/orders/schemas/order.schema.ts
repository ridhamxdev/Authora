import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop([
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: MongooseSchema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ])
    orderItems: {
        name: string;
        qty: number;
        image: string;
        price: number;
        product: Product;
    }[];

    @Prop({
        type: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        required: true,
    })
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };

    @Prop({ required: true })
    paymentMethod: string;

    @Prop({
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    })
    paymentResult: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };

    @Prop({ required: true, default: 0.0 })
    taxPrice: number;

    @Prop({ required: true, default: 0.0 })
    shippingPrice: number;

    @Prop({ required: true, default: 0.0 })
    totalPrice: number;

    @Prop({ required: true, default: false })
    isPaid: boolean;

    @Prop()
    paidAt: Date;

    @Prop({ required: true, default: false })
    isDelivered: boolean;

    @Prop()
    deliveredAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
