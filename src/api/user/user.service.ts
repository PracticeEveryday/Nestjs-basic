import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { comparePassword, hashPassword } from 'src/common/utils/hash-password.utils';
import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { UserEntity } from './entitys/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository, private authService: AuthService) {}

    public async signUp(signUpDto: SignUpReqDto): Promise<UserEntity> {
        const user = await this.userRepository.findOneByEmail(signUpDto.email);
        if (user) {
            throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
        }
        signUpDto.password = await hashPassword(signUpDto.password);
        return await this.userRepository.signUp(signUpDto);
    }

    public findOneById = async (userId: number): Promise<UserEntity> => {
        const user = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new UnauthorizedException('해당 id의 유저가 없습니다.');
        }

        return user;
    };

    public async signIn(signInDto: SignInReqDto) {
        const user = await this.userRepository.findOneByEmail(signInDto.email);
        if (!user) {
            throw new UnauthorizedException('해당 이메일로 가입된 유저가 없습니다.');
        }

        const isMatch = await comparePassword(signInDto.password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        const token = this.authService.signToken(user.userId);
        return token;
    }
}
