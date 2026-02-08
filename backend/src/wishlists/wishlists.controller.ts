import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
    constructor(private readonly wishlistsService: WishlistsService) { }

    @Get()
    getUserWishlists(@Request() req: any) {
        return this.wishlistsService.getUserWishlists(req.user.userId);
    }

    @Post()
    createWishlist(
        @Body('name') name: string,
        @Body('description') description: string,
        @Request() req: any,
    ) {
        return this.wishlistsService.createWishlist(req.user.userId, name, description);
    }

    @Get(':id')
    getWishlistById(@Param('id') id: string, @Request() req: any) {
        return this.wishlistsService.getWishlistById(id, req.user.userId);
    }

    @Post(':id/items')
    addItemToWishlist(
        @Param('id') id: string,
        @Body('productUrl') productUrl: string,
        @Body('notes') notes: string,
        @Body('priority') priority: number,
        @Request() req: any,
    ) {
        return this.wishlistsService.addItemToWishlist(
            id,
            req.user.userId,
            productUrl,
            notes,
            priority,
        );
    }

    @Put('items/:itemId')
    updateWishlistItem(
        @Param('itemId') itemId: string,
        @Body() updates: { notes?: string; priority?: number; isPurchased?: boolean },
        @Request() req: any,
    ) {
        return this.wishlistsService.updateWishlistItem(itemId, req.user.userId, updates);
    }

    @Delete('items/:itemId')
    deleteWishlistItem(@Param('itemId') itemId: string, @Request() req: any) {
        return this.wishlistsService.deleteWishlistItem(itemId, req.user.userId);
    }

    @Delete(':id')
    deleteWishlist(@Param('id') id: string, @Request() req: any) {
        return this.wishlistsService.deleteWishlist(id, req.user.userId);
    }
}
