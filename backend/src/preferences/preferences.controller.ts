import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getPreferences(@Request() req: any) {
        let preferences = await this.prisma.shoppingPreference.findUnique({
            where: { userId: req.user.userId },
        });

        if (!preferences) {
            preferences = await this.prisma.shoppingPreference.create({
                data: {
                    userId: req.user.userId,
                    favoriteBrands: [],
                    platforms: [],
                },
            });
        }

        return preferences;
    }

    @Put()
    async updatePreferences(
        @Body()
        updates: {
            favoriteBrands?: string[];
            budgetRanges?: any;
            sizes?: any;
            platforms?: string[];
        },
        @Request() req: any,
    ) {
        return this.prisma.shoppingPreference.upsert({
            where: { userId: req.user.userId },
            create: {
                userId: req.user.userId,
                ...updates,
            },
            update: updates,
        });
    }
}
