import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from '../services/documents.service';
import {
  getUserFromRequestToken,
  uploadOptions,
} from 'src/middleware/fileupload.utils';
import { DocumentBuilder } from '../document.builder';
import { UserBuilder } from 'src/users/user.builder';
import jwt_decode from 'jwt-decode';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const {
      user: { id },
    } = getUserFromRequestToken(req);
    
    let document = new DocumentBuilder()
      .setFile(file.path)
      .setOwnerID(id)
      .build();
    return this.documentService.createDocument(document);
  }

  @Get()
  getAllDocumentsByUser(@Query('user_id') owner_id: number) {
    return this.documentService.findAllDocumentsByUser(owner_id);
  }

  @Post(':id/share')
  shareDocument(@Body() body) {
    console.log(body);
    return;
  }
}
