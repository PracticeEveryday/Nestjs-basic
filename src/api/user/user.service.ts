import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { UserEntity } from './entitys/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    public async signUp(signUpDto: SignUpReqDto): Promise<UserEntity> {
        const user = await this.userRepository.findOneByEmail(signUpDto.email);
        if (user) {
            throw new BadRequestException('해당 이메일은 이미 사용중입니다.');
        }
        return await this.userRepository.signUp(signUpDto);
    }

    public findOneById = async (userId: number): Promise<UserEntity | null> => {
        return await this.userRepository.findOneById(userId);
    };

    public async signIn(signInDto: SignInReqDto) {
        const user = await this.userRepository.findOneByEmail(signInDto.email);
        if (user) {
            throw new UnauthorizedException('해당 이메일로 가입된 유저가 없습니다.');
        }
        return user;
    }
}
