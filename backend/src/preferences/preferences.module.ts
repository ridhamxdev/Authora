import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PreferencesController],
})
export class PreferencesModule { }
