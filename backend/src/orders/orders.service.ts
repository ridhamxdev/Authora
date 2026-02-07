import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

    async create(createOrderDto: any): Promise<OrderDocument> {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice, // Calculate on backend ideally, but trusting frontend for now or validating
            taxPrice,
            shippingPrice,
            totalPrice,
            user,
        } = createOrderDto;

        const order = new this.orderModel({
            orderItems,
            user: user,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        return createdOrder;
    }

    async findById(id: string): Promise<OrderDocument> {
        const order = await this.orderModel.findById(id).populate('user', 'name email').exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async findMyOrders(userId: string): Promise<OrderDocument[]> {
        return this.orderModel.find({ user: userId } as any).exec();
    }
}
