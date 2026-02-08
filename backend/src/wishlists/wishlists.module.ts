import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
    imports: [PrismaModule, ScraperModule],
    controllers: [WishlistsController],
    providers: [WishlistsService],
    exports: [WishlistsService],
})
export class WishlistsModule { }
