import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
];

export const uploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: './upload',
    filename: createFileName,
  }),
  fileFilter: validateUploadRequest,
};

function validateUploadRequest(req, file, cb) {
  const { owner_id: id } = req.body;
  console.log(id);
  if (!file || !id) {
    cb(null, false);
    // throw new BadRequestException();
  }

  if (!mimeTypeIsValid(file)) {
    const { path, destination } = file;
    console.log(destination + path);
    cb(null, false);
    // throw new UnsupportedMediaTypeException({ ...file });
  }
  cb(null, true);
}

function createFileName(req, file, callback) {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `${name}_${Date.now()}${fileExtName}`);
}

function mimeTypeIsValid(file: Express.Multer.File) {
  return ACCEPTED_MIME_TYPES.includes(file.mimetype);
}
