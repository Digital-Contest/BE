import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { envs } from '../config/environment';

export const createUploadImage = (s3Client: S3Client) => multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'eco-marketer',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `images/${Date.now()}_${file.originalname}`);
    }
  })
});

const s3Client = new S3Client({
  credentials: {
    accessKeyId: envs.s3.accessKey as string,
    secretAccessKey: envs.s3.secretKey as string,
  },
  region: 'ap-northeast-2',
});

export const uploadImage = createUploadImage(s3Client);
