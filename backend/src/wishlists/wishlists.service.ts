import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';

@Injectable()
export class WishlistsService {
    constructor(
        private prisma: PrismaService,
        private scraperService: ScraperService,
    ) { }

    async createWishlist(userId: string, name: string, description?: string) {
        return this.prisma.wishlist.create({
            data: {
                userId,
                name,
                description,
            },
        });
    }

    async getUserWishlists(userId: string) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getWishlistById(id: string, userId: string) {
        const wishlist = await this.prisma.wishlist.findFirst({
            where: { id, userId },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!wishlist) {
            throw new NotFoundException('Wishlist not found');
        }

        return wishlist;
    }

    async addItemToWishlist(
        wishlistId: string,
        userId: string,
        productUrl: string,
        notes?: string,
        priority?: number,
    ) {
        // Verify wishlist belongs to user
        const wishlist = await this.getWishlistById(wishlistId, userId);

        // Scrape product details
        const scrapedData = await this.scraperService.scrapeProductDetails(productUrl);

        return this.prisma.wishlistItem.create({
            data: {
                wishlistId,
                productUrl,
                name: scrapedData.name,
                price: scrapedData.price,
                currency: scrapedData.currency,
                image: scrapedData.image,
                platform: scrapedData.platform,
                notes,
                priority: priority || 3,
            },
        });
    }

    async updateWishlistItem(
        itemId: string,
        userId: string,
        updates: { notes?: string; priority?: number; isPurchased?: boolean },
    ) {
        // Verify item belongs to user's wishlist
        const item = await this.prisma.wishlistItem.findFirst({
            where: {
                id: itemId,
                wishlist: { userId },
            },
        });

        if (!item) {
            throw new NotFoundException('Wishlist item not found');
        }

        return this.prisma.wishlistItem.update({
            where: { id: itemId },
            data: {
                ...updates,
                purchasedAt: updates.isPurchased ? new Date() : item.purchasedAt,
            },
        });
    }

    async deleteWishlistItem(itemId: string, userId: string) {
        const item = await this.prisma.wishlistItem.findFirst({
            where: {
                id: itemId,
                wishlist: { userId },
            },
        });

        if (!item) {
            throw new NotFoundException('Wishlist item not found');
        }

        return this.prisma.wishlistItem.delete({
            where: { id: itemId },
        });
    }

    async deleteWishlist(id: string, userId: string) {
        const wishlist = await this.prisma.wishlist.findFirst({
            where: { id, userId },
        });

        if (!wishlist) {
            throw new NotFoundException('Wishlist not found');
        }

        return this.prisma.wishlist.delete({
            where: { id },
        });
    }
}
