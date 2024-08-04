import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { createUploadImage } from '../../src/util/s3Upload';

jest.mock('multer');
jest.mock('multer-s3');
jest.mock('@aws-sdk/client-s3');
describe('uploadImage 테스트', () => {

    describe('uploadImage 함수 테스트', () => {
        let upload:any;
        let s3ClientMock:any;
        beforeEach(() => {
            s3ClientMock = new S3Client({
                credentials: {
                  accessKeyId: 'mockAccessKeyId',
                  secretAccessKey: 'mockSecretAccessKey',
                },
                region: 'ap-northeast-2',
              });
              multer.mockReturnValue({ any: jest.fn() });
              upload =createUploadImage(s3ClientMock);
          });

        it('uploadImage 함수 정상 처리', async () => {
            expect(multerS3).toHaveBeenCalledWith(expect.objectContaining({
                s3: s3ClientMock,
                bucket: 'eco-marketer',
                acl: 'public-read',
                contentType: multerS3.AUTO_CONTENT_TYPE,
              }));
        });

        it('key 함수', () => {
            const keyFunction = multerS3.mock.calls[0][0].key;
            const cb = jest.fn();
            const req = {};
            const file = { originalname: 'test.png' };
            keyFunction(req, file, cb);
            expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/^images\/\d+_test\.png$/));
          });

    });
});