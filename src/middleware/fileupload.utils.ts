import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import jwt_decode from 'jwt-decode';
// TODO: update accepted mime types array
const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
];

export const uploadOptions: MulterOptions = {
  fileFilter: validateUploadRequest,
  storage: diskStorage({
    destination: './upload',
    filename: createFileName,
  }),
};

function validateUploadRequest(req, file, cb) {
  const {
    user: { id },
  } = req;
  if (!file || !id) {
    return cb(new BadRequestException());
    // throw ;
  }

  console.log(mimeTypeIsValid(file));
  if (!mimeTypeIsValid(file)) {
    console.log('test');
    return cb(new UnsupportedMediaTypeException());
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

export function getUserFromRequestToken(req: any): any {
  const { authorization: token } = req.headers;
  return jwt_decode(token.split(' ')[1]);
}
