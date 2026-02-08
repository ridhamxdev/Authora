import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { RagService } from './rag.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rag')
@UseGuards(JwtAuthGuard)
export class RagController {
    constructor(private readonly ragService: RagService) { }

    @Post('search')
    async semanticSearch(
        @Body('query') query: string,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.ragService.semanticSearch(query, userId);
    }

    @Post('chat')
    async chatWithNotes(
        @Body('query') query: string,
        @Request() req: any,
    ) {
        const userId = req.user.userId;
        const response = await this.ragService.chatWithNotes(query, userId);
        return { response };
    }

    @Get('recommend')
    async getRecommendations(@Request() req: any) {
        const userId = req.user.userId;
        return this.ragService.getRecommendations(userId);
    }
}
