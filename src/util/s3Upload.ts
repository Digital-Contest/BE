import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { createRequire } from 'module'
import { envs } from '../config/environment';
const require = createRequire(import.meta.url)
require('dotenv').config();



export const uploadImage = multer({
  storage: multerS3({
    s3: new S3Client({
      credentials: {
        accessKeyId: envs.s3.accessKey as string,
        secretAccessKey: envs.s3.secretKey as string,
      },
      region: 'ap-northeast-2',
    }),
    bucket: 'eco-marketer',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `images/${Date.now()}_${file.originalname} `);
    }
  })
});


