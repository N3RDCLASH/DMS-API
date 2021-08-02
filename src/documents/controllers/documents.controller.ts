import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShareDocumentDto, UploadFileDto } from '../models/document.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  uploadFile(
    @Body() uploadFileDto: UploadFileDto,
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
  @Get(':id')
  getOneDocument(@Param('id') id: number) {
    return this.documentService.findSingleDocument(id);
  }
  @Delete(':id')
  deleteOneDocument(@Param('id') id: number) {
    return this.documentService.deleteOneDocument(id);
  }

  // todo: add documentshare fucntionality to controller
  @Post(':id/share')
  shareDocument(
    @Param('id') document_id: number,
    @Body() shareDocumentDto: ShareDocumentDto,
  ) {
    const { user_id } = shareDocumentDto;
    console.log(document_id, shareDocumentDto);
    return this.documentService.shareDocumentWithUser(document_id, user_id);
  }
}
