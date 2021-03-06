import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/models/user.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentsController } from './controllers/documents.controller';
import { Document } from './models/document.entity';
import { DocumentsService } from './services/documents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, User]), UsersModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
