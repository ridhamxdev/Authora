import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RagService } from '../rag/rag.service';

@Injectable()
export class NotesService {
    constructor(
        private prisma: PrismaService,
        private ragService: RagService,
    ) { }

    async createNote(
        userId: string,
        title: string,
        content: string,
        tags: string[],
    ) {
        // Generate embedding for the note
        const embedding = await this.ragService.generateEmbedding(
            `${title} ${content}`,
        );

        // Use raw SQL to insert with embedding
        const result = await this.prisma.$queryRaw`
      INSERT INTO "Note" ("id", "userId", "title", "content", "tags", "embedding", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${userId}, ${title}, ${content}, ${tags}::text[], ${embedding}::vector, NOW(), NOW())
      RETURNING *
    ` as any[];

        return result[0];
    }

    async getUserNotes(userId: string) {
        return this.prisma.note.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                content: true,
                tags: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getNoteById(id: string, userId: string) {
        const note = await this.prisma.note.findFirst({
            where: { id, userId },
            select: {
                id: true,
                title: true,
                content: true,
                tags: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!note) {
            throw new NotFoundException('Note not found');
        }

        return note;
    }

    async updateNote(
        id: string,
        userId: string,
        updates: { title?: string; content?: string; tags?: string[] },
    ) {
        const note = await this.getNoteById(id, userId);

        // Regenerate embedding if title or content changed
        if (updates.title || updates.content) {
            const newTitle = updates.title || note.title;
            const newContent = updates.content || note.content;
            const embedding = await this.ragService.generateEmbedding(
                `${newTitle} ${newContent}`,
            );

            // Update with embedding
            const result = await this.prisma.$queryRaw`
        UPDATE "Note"
        SET "title" = ${updates.title || note.title},
            "content" = ${updates.content || note.content},
            "tags" = ${updates.tags || note.tags}::text[],
            "embedding" = ${embedding}::vector,
            "updatedAt" = NOW()
        WHERE "id" = ${id}
        RETURNING "id", "title", "content", "tags", "createdAt", "updatedAt"
      ` as any[];
            return result[0];
        }

        // Update without embedding
        return this.prisma.note.update({
            where: { id },
            data: updates,
            select: {
                id: true,
                title: true,
                content: true,
                tags: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async deleteNote(id: string, userId: string) {
        const note = await this.getNoteById(id, userId);

        return this.prisma.note.delete({
            where: { id },
        });
    }
}
