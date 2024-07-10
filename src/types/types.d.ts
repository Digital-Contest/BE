
import {Request} from "express";
import * as multer from 'multer-s3';

interface decodedToken {
    user_id: number;
  }

declare global{

  namespace Express {
    export interface Request {
      decoded :decodedToken;
      user: decodedToken;
    }
    export interface MulterS3File extends multer.File {
      location: string;
    }
  }
}



