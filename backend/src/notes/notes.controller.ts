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
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Get()
    getUserNotes(@Request() req: any) {
        return this.notesService.getUserNotes(req.user.userId);
    }

    @Post()
    createNote(
        @Body('title') title: string,
        @Body('content') content: string,
        @Body('tags') tags: string[],
        @Request() req: any,
    ) {
        return this.notesService.createNote(req.user.userId, title, content, tags || []);
    }

    @Get(':id')
    getNoteById(@Param('id') id: string, @Request() req: any) {
        return this.notesService.getNoteById(id, req.user.userId);
    }

    @Put(':id')
    updateNote(
        @Param('id') id: string,
        @Body() updates: { title?: string; content?: string; tags?: string[] },
        @Request() req: any,
    ) {
        return this.notesService.updateNote(id, req.user.userId, updates);
    }

    @Delete(':id')
    deleteNote(@Param('id') id: string, @Request() req: any) {
        return this.notesService.deleteNote(id, req.user.userId);
    }
}
