import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    async findById(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }
}
