import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { AuthController } from '../../src/controller/Auth.Controller';
import { AuthService } from '../../src/service/Auth.Service';
import { SuccessResponseDto } from '../../src/response/SuccessResponseDto';
import { LoginResponse } from '../../src/dto/response/loginResponse';
import { Request, Response } from 'express';
//import chaiAsPromised from 'chai-as-promised';


//chai.use(chaiAsPromised);

describe('AuthController', () => {
    let authService: AuthService;
    let authController: AuthController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        authService = sinon.createStubInstance(AuthService);
        authController = new AuthController(authService);
        req = {};
        res = {};
    });

    describe('kakaoLogin', () => {
        it('should login with kakao and return a success response', async () => {
            const loginResponse: LoginResponse = LoginResponse.of('dummy-token', 'dummy-token', 'user');
            (authService.kakaoLogin as sinon.SinonStub).resolves(loginResponse);

            req.headers = { authorization: 'Bearer dummy-auth' };

            const result = await authController.kakaoLogin(req as Request);

         
            expect(result).to.deep.equal(SuccessResponseDto.of(loginResponse));
        });
    });

    describe('logout', () => {
        it('should logout and return a success response', async () => {
            (req as any).decoded = { user_id: 'dummy-user-id' };

            const result = await authController.logout(req as Request);

            expect(result).to.deep.equal(SuccessResponseDto.of());
        });
    });

    describe('reissueToken', () => {
        it('should reissue token and return a success response', async () => {
            const tokenResponse = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
            (authService.reissueToken as sinon.SinonStub).resolves(tokenResponse);

            req.headers = {
                authorization: 'Bearer old-access-token',
                refresh: 'old-refresh-token'
            };

            const result = await authController.reissueToken(req as Request);
            expect(result).to.deep.equal(SuccessResponseDto.of(tokenResponse));
        });
    });
});