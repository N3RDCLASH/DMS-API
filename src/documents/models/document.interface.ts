import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
export class CreateDocumentDto {
  @ApiProperty()
  file: string;
  @ApiProperty()
  owner_id: number;
}
export class ShareDocumentDto {
  @ApiProperty()
  user_id: number;
}
