import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Request,
  Res,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShareDocumentDto, UploadFileDto } from '../models/document.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { join } from 'path';
import { map } from 'rxjs/operators';
import * as escape from 'escape-path-with-spaces';
import { hasPermission } from 'src/auth/decorators/permissions.decorator';
import {
  CREATE_DOCUMENTS,
  DELETE_DOCUMENTS,
  READ_DOCUMENTS,
  SHARE_DOCUMENTS,
} from 'src/permissions/constants/permissions.constants';
import { PermissionGuard } from 'src/auth/gaurds/permissions.guard';
@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  @hasPermission(CREATE_DOCUMENTS)
  uploadFile(
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
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
  @hasPermission(READ_DOCUMENTS)
  getAllDocumentsByUser(@Req() req: Request) {
    const {
      user: { id },
    } = getUserFromRequestToken(req);
    return this.documentService.findAllDocumentsByUser(id);
  }

  @Get(':id')
  @hasPermission(READ_DOCUMENTS)
  getOneDocument(@Param('id') id: number) {
    return this.documentService.findSingleDocument(id);
  }

  @Get(':id/download')
  downloadOneDocument(@Param('id') id: number, @Res() res) {
    return this.documentService.findSingleDocument(id).pipe(
      map(async (document) => {
        res.header('X-Suggested-Filename', document.file.split('\\')[1]);
        res.download(join(process.cwd(), escape(document.file)));
      }),
    );
  }

  @Delete(':id')
  @hasPermission(DELETE_DOCUMENTS)
  deleteOneDocument(@Param('id') id: number) {
    return this.documentService.deleteOneDocument(id);
  }

  @Post(':id/share')
  @hasPermission(SHARE_DOCUMENTS)
  shareDocument(
    @Param('id') document_id: number,
    @Body() shareDocumentDto: ShareDocumentDto,
  ) {
    const { user_id } = shareDocumentDto;
    console.log(document_id, shareDocumentDto);
    return this.documentService.shareDocumentWithUser(document_id, user_id);
  }
}
