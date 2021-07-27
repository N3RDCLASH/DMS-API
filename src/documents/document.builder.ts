import { Document } from './models/document.interface';

export class DocumentBuilder {
  private readonly _document: Document;
  constructor() {
    this._document = {
      file: '',
      owner_id: null,
    };
  }
  setFile(filepath: string): DocumentBuilder {
    this._document.file = filepath;
    return this;
  }
  setOwnerID(owner_id: number): DocumentBuilder {
    this._document.owner_id = owner_id;
    return this;
  }
  build() {
    return this._document;
  }
}
