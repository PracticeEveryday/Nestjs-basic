import { User } from '@/api/user/interfaces/user.interface';
import { comparePassword, hashPassword } from '@/common/utils/hash-password.utils';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private authRepository: AuthRepository) {}

    public async signUp(signUpDto: SignUpReqDto): Promise<User> {
        const user = await this.authRepository.findOneByEmail(signUpDto.email);
        if (user) {
            throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
        }
        signUpDto.password = await hashPassword(signUpDto.password);
        return await this.authRepository.signUp(signUpDto);
    }

    public findOneById = async (userId: number): Promise<User> => {
        const user = await this.authRepository.findOneById(userId);
        if (!user) {
            throw new UnauthorizedException('해당 id의 유저가 없습니다.');
        }

        return user;
    };

    public async signIn(signInDto: SignInReqDto): Promise<{ token: string }> {
        const user = await this.authRepository.findOneByEmail(signInDto.email);
        if (!user) {
            throw new UnauthorizedException('해당 이메일로 가입된 유저가 없습니다.');
        }

        const isMatch = await comparePassword(signInDto.password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        const token = this.signToken(user.userId);
        return { token };
    }

    private signToken(userId: number): string {
        const payload = { userId };
        const token = this.jwtService.sign(payload);

        return token;
    }
}
