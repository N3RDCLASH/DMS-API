import { BadRequestException, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../models/document.interface';
import { Document as DocumentEntity } from '../models/document.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/models/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createDocument(document: Document): Observable<Document> {
    return from(this.documentRepository.save(document));
  }

  findAllDocumentsByUser(user_id: number): Observable<Document[]> {
    return from(this.documentRepository.find({ where: { owner_id: user_id } }));
  }

  findSingleDocument(id: number): Observable<Document> {
    if (id == undefined) throw new BadRequestException();
    return from(this.documentRepository.findOne(id));
  }

  deleteOneDocument(id: number) {
    return from(this.documentRepository.softDelete(id));
  }

  async shareDocumentWithUser(document_id: number, user_id: number) {
    const document = await this.documentRepository.findOne(document_id);
    const user = await this.userRepository.findOne(user_id);
    document.shared_users = [user];
    return this.documentRepository.save(document);
  }
  // todo: add documentshare fucntionality to service
}
