import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentDto } from '../models/document.interface';
import { Document as DocumentEntity } from '../models/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) {}

  createDocument(document: CreateDocumentDto): Observable<CreateDocumentDto> {
    return from(this.documentRepository.save(document));
  }

  findAllDocumentsByUser(user_id: number): Observable<CreateDocumentDto[]> {
    return from(this.documentRepository.find({ where: { owner_id: user_id } }));
  }
  
  findSingleDocument(id: number): Observable<CreateDocumentDto> {
    return from(this.documentRepository.findOne(id));
  }
}
