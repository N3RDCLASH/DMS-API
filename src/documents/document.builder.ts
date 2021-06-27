import { Document } from './models/document.interface';

export class DocumentBuilder {
  private readonly _document: Document;
  constructor(private file: string, private owner_id: number) {
    this._document = {
      file: '',
      owner_id: null,
    };
  }
  setFile(filepath: string): Document {
    this._document.file = filepath;
    return this._document;
  }
  setOwnerID(owner_id: number): Document {
    this._document.owner_id = owner_id;
    return this._document;
  }
  build() {
    return this._document;
  }
}
