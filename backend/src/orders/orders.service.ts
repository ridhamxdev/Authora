import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(createOrderDto: any): Promise<Order> {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user,
        } = createOrderDto;

        // Prisma requires a different structure for nested creates if we want to create OrderItems conveniently
        // Mapping orderItems to Prisma's expected format
        const formattedOrderItems = orderItems.map((item: any) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            productId: item.product, // Assuming item.product is the ID from frontend
        }));

        return this.prisma.order.create({
            data: {
                userId: user, // userId passed from controller
                orderItems: {
                    create: formattedOrderItems,
                },
                shippingAddress: shippingAddress, // Passed as JSON object, Prisma handles JSON
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice,
            },
            include: {
                orderItems: true,
            },
        });
    }

    async findById(id: string): Promise<Order | null> {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                orderItems: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async findMyOrders(userId: string): Promise<Order[]> {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: true,
            },
        });
    }
}
