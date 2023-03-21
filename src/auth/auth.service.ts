import { BadRequestException, Inject, Injectable, LoggerService, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { comparePassword, hashPassword } from '🔥/common/utils/hash-password.utils';
import { UserEntity } from '🔥/database/entitys/user.entity';

import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { AuthRepositoryImpl } from './repository/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private authRepository: AuthRepositoryImpl,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}

    public async signUp(signUpDto: SignUpReqDto): Promise<UserEntity> {
        this.logger.log('회원 가입');
        const user = await this.authRepository.findOneByEmail(signUpDto.email);
        if (user) {
            throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
        }
        signUpDto.password = await hashPassword(signUpDto.password);
        return await this.authRepository.signUp(signUpDto);
    }

    public findOneById = async (userId: number): Promise<UserEntity> => {
        const user = await this.authRepository.findOneById(userId);
        if (!user) {
            throw new UnauthorizedException('해당 id의 유저가 없습니다.');
        }

        return user;
    };

    public async signIn(signInDto: SignInReqDto): Promise<{ accessToken: string; refreshToken: string }> {
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
    }

    private signToken(userId: number): { accessToken: string; refreshToken: string } {
        const payload = { userId };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const refreshToken = this.jwtService.sign({}, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    // @Cron('* * * * *')
    // handleCron() {
    //     this.logger.log(`1분 마다 실행`);
    // }
}
