import { BadRequestException, HttpException, Inject, Injectable, LoggerService, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';
// import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { comparePassword, hashPassword } from '🔥/common/utils/hash-password.utils';
import { AuthRepository, UserInterface } from '🔥/domain/user.domain';

import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { AuthRepositoryImpl } from './repository/auth.repository';

@Injectable()
export class AuthService {
    private secretKey: string;
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(AuthRepositoryImpl) private authRepository: AuthRepository,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {
        this.secretKey = this.configService.get<string>('JWT_PRIVATE_KEY') || '';
    }

    public signUp = async (signUpDto: SignUpReqDto): Promise<UserInterface> => {
        this.logger.log('회원 가입');
        const user = await this.authRepository.findOneByEmail(signUpDto.email);
        if (user) {
            throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
        }
        signUpDto.password = await hashPassword(signUpDto.password);
        return await this.authRepository.signUp(signUpDto);
    };

    public findOneById = async (userId: number): Promise<UserInterface> => {
        const user = await this.authRepository.findOneById(userId);
        if (!user) {
            throw new UnauthorizedException('해당 id의 유저가 없습니다.');
        }

        return user;
    };

    public signIn = async (signInDto: SignInReqDto): Promise<{ accessToken: string; refreshToken: string }> => {
        const user = await this.authRepository.findOneByEmail(signInDto.email);
        if (!user) {
            throw new UnauthorizedException('해당 이메일로 가입된 유저가 없습니다.');
        }

        const isMatch = await comparePassword(signInDto.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        const { accessToken, refreshToken } = this.signToken(user.userId);
        return { accessToken, refreshToken };
    };

    private signToken = (userId: number): { accessToken: string; refreshToken: string } => {
        const payload = { userId };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign({}, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    };

    public validateToken = (token: string) => {
        try {
            const verify = this.jwtService.verify(token, { secret: this.secretKey });
            return verify;
        } catch (e: unknown) {
            if (e instanceof JsonWebTokenError) {
                console.log('message: ', e.message);
                switch (e.message) {
                    // 토큰에 대한 오류를 판단합니다.
                    case 'invalid signature':
                        throw new HttpException(`유효하지 않은 토큰입니다.: ${e.message}`, 401);
                    case 'jwt malformed':
                        throw new HttpException(`유효하지 않은 토큰입니다.: ${e.message}`, 401);
                    case 'jwt expired':
                        throw new HttpException(`토큰이 만료되었습니다.: ${e.message}`, 410);
                    default:
                        throw new HttpException(`서버 오류입니다.: ${e.message}`, 500);
                }
            }
        }
    };

    public decodeJWT = (token: string) => {
        if (!token) throw new UnauthorizedException('Token 전송 안됨');

        const base64Url = token.split('.')[1];
        if (!base64Url) throw new UnauthorizedException('토큰에 문제가 있습니다.');

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    };

    public reissueTokenFlow = (accessToken: string, refreshToken: string) => {
        let flag = 0;
        const { userId } = this.decodeJWT(accessToken);

        const decodedAccessToken = this.tokenVerify(accessToken);
        const decodedRefreshToken = this.tokenVerify(refreshToken);
        console.log(decodedRefreshToken, 'decodedRefreshToken');
        if (decodedAccessToken instanceof JsonWebTokenError && decodedRefreshToken instanceof JsonWebTokenError) {
            throw new UnauthorizedException('다시 로그인 해주세요');
        } else if (decodedAccessToken instanceof JsonWebTokenError) {
            flag = 1;
            const { accessToken: newAccess, refreshToken: newRefresh } = this.signToken(userId);
            return { newAccess, newRefresh, flag };
        } else if (decodedRefreshToken instanceof JsonWebTokenError) {
            flag = 2;
            const { accessToken: newAccess, refreshToken: newRefresh } = this.signToken(userId);
            return { newAccess, newRefresh, flag };
        } else {
            flag = 3;
            return { flag };
        }
    };

    private tokenVerify = (token: string) => {
        try {
            const decoded = this.jwtService.verify(token, { secret: this.secretKey });

            return decoded;
        } catch (error) {
            if (error instanceof JsonWebTokenError) return error;
        }
    };

    // @Cron('* * * * *')
    // handleCron() {
    //     this.logger.log(`1분 마다 실행`);
    // }
}
