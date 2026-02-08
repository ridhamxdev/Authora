import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RagModule } from '../rag/rag.module';

@Module({
    imports: [PrismaModule, RagModule],
    controllers: [NotesController],
    providers: [NotesService],
    exports: [NotesService],
})
export class NotesModule { }
