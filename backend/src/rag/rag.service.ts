import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RagService {
    private hf: HfInference;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');
        this.hf = new HfInference(apiKey);
    }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: text,
            });

            // Convert to number array - handle different response formats
            if (Array.isArray(response)) {
                return response as number[];
            }
            // If it's a nested array, flatten it
            return Array.from(response as any) as number[];
        } catch (error) {
            console.error('Embedding generation failed:', error);
            throw new Error('Failed to generate embedding');
        }
    }

    async semanticSearch(query: string, userId: string, limit: number = 5) {
        try {
            const queryEmbedding = await this.generateEmbedding(query);

            // Use raw SQL for pgvector cosine similarity search
            const results = await this.prisma.$queryRaw`
        SELECT id, title, content, tags,
               1 - (embedding <=> ${queryEmbedding}::vector) as similarity
        FROM "Note"
        WHERE "userId" = ${userId}
        ORDER BY embedding <=> ${queryEmbedding}::vector
        LIMIT ${limit}
      `;

            return results;
        } catch (error) {
            console.error('Semantic search failed:', error);
            return [];
        }
    }

    async chatWithNotes(query: string, userId: string): Promise<string> {
        try {
            // Get relevant notes using semantic search
            const relevantNotes = (await this.semanticSearch(query, userId, 3)) as any[];

            // Build context from notes
            const context = relevantNotes
                .map((note: any) => `${note.title}: ${note.content}`)
                .join('\n\n');

            // Create prompt for LLM
            const prompt = `You are a helpful assistant that answers questions based on the user's notes.

Context from notes:
${context}

User question: ${query}

Answer:`;

            // Use Hugging Face Inference API for chat
            const response = await this.hf.textGeneration({
                model: 'meta-llama/Llama-3.2-1B-Instruct',
                inputs: prompt,
                parameters: {
                    max_new_tokens: 200,
                    temperature: 0.7,
                },
            });

            return response.generated_text || 'I could not generate a response.';
        } catch (error) {
            console.error('Chat failed:', error);
            return 'Sorry, I encountered an error processing your request.';
        }
    }

    async getRecommendations(userId: string): Promise<any[]> {
        try {
            // Get user's shopping preferences
            const preferences = await this.prisma.shoppingPreference.findUnique({
                where: { userId },
            });

            if (!preferences) {
                return [];
            }

            // Get user's wishlist items
            const wishlists = await this.prisma.wishlist.findMany({
                where: { userId },
                include: {
                    items: {
                        where: { isPurchased: false },
                        take: 10,
                    },
                },
            });

            // Simple recommendation: prioritize items matching favorite brands
            const allItems = wishlists.flatMap((w) => w.items);
            const recommendations = allItems.filter((item) =>
                preferences.favoriteBrands.some((brand) =>
                    item.name.toLowerCase().includes(brand.toLowerCase()),
                ),
            );

            return recommendations.slice(0, 5);
        } catch (error) {
            console.error('Recommendations failed:', error);
            return [];
        }
    }
}
