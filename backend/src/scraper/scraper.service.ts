import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
    name: string;
    price: number | null;
    currency: string;
    image: string | null;
    platform: string;
}

@Injectable()
export class ScraperService {
    private readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    async scrapeProductDetails(url: string): Promise<ScrapedProduct> {
        try {
            const platform = this.detectPlatform(url);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.USER_AGENT,
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                timeout: 10000,
            });

            const $ = cheerio.load(response.data);

            let product: ScrapedProduct;

            switch (platform) {
                case 'Amazon':
                    product = this.scrapeAmazon($, url);
                    break;
                case 'Flipkart':
                    product = this.scrapeFlipkart($, url);
                    break;
                default:
                    product = this.scrapeFallback($, url, platform);
            }

            return product;
        } catch (error) {
            throw new BadRequestException(
                `Failed to scrape product: ${error.message}`,
            );
        }
    }

    private detectPlatform(url: string): string {
        if (url.includes('amazon.')) return 'Amazon';
        if (url.includes('flipkart.')) return 'Flipkart';
        if (url.includes('myntra.')) return 'Myntra';
        if (url.includes('ajio.')) return 'Ajio';
        return 'Unknown';
    }

    private scrapeAmazon($: cheerio.CheerioAPI, url: string): ScrapedProduct {
        const name =
            $('#productTitle').text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            'Unknown Product';

        const priceWhole = $('.a-price-whole').first().text().replace(/[^0-9]/g, '');
        const priceFraction = $('.a-price-fraction').first().text();
        const price = priceWhole ? parseFloat(`${priceWhole}.${priceFraction || '00'}`) : null;

        const image =
            $('.a-dynamic-image').first().attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            null;

        return {
            name,
            price,
            currency: 'INR',
            image,
            platform: 'Amazon',
        };
    }

    private scrapeFlipkart($: cheerio.CheerioAPI, url: string): ScrapedProduct {
        const name =
            $('.B_NuCI').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            'Unknown Product';

        const priceText = $('._30jeq3').first().text().replace(/[^0-9]/g, '');
        const price = priceText ? parseFloat(priceText) : null;

        const image =
            $('._396cs4').first().attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            null;

        return {
            name,
            price,
            currency: 'INR',
            image,
            platform: 'Flipkart',
        };
    }

    private scrapeFallback(
        $: cheerio.CheerioAPI,
        url: string,
        platform: string,
    ): ScrapedProduct {
        // Use Open Graph meta tags as fallback
        const name =
            $('meta[property="og:title"]').attr('content') ||
            $('title').text() ||
            'Unknown Product';

        const priceAmount = $('meta[property="og:price:amount"]').attr('content');
        const price = priceAmount ? parseFloat(priceAmount) : null;

        const currency =
            $('meta[property="og:price:currency"]').attr('content') || 'INR';

        const image = $('meta[property="og:image"]').attr('content') || null;

        return {
            name,
            price,
            currency,
            image,
            platform,
        };
    }

    getSupportedPlatforms(): string[] {
        return ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Other (via Open Graph)'];
    }
}
