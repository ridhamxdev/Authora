import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ScraperService, ScrapedProduct } from './scraper.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scraper')
@UseGuards(JwtAuthGuard)
export class ScraperController {
    constructor(private readonly scraperService: ScraperService) { }

    @Post('scrape')
    async scrapeProduct(@Body('url') url: string): Promise<ScrapedProduct | { error: string }> {
        if (!url) {
            return { error: 'URL is required' };
        }
        return this.scraperService.scrapeProductDetails(url);
    }

    @Get('platforms')
    getSupportedPlatforms() {
        return {
            platforms: this.scraperService.getSupportedPlatforms(),
        };
    }
}
