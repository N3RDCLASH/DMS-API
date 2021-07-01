import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from '../services/documents.service';
import { uploadOptions } from 'src/middleware/fileupload.utils';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('owner_id') id: number,
  ) {
    return file;
  }

  @Get()
  getAllDocumentsByUser(@Query('user_id') owner_id: number) {
    return this.documentService.findAllDocumentsByUser(owner_id);
  }
}
