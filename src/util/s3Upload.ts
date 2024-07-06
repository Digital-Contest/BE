


import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config();



export const uploadImage = multer({
  storage: multerS3({
    s3: new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
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


