import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectionToken } from 'src/database/injection.token';
import { UserEntity } from '../entitys/user.entity';
import { SignUpReqDto } from '../dtos/request/sign-up.req.dto';

@Injectable()
export class UserRepository {
    constructor(
        @Inject(InjectionToken.USER_REPOSITORY)
        private userRepository: Repository<UserEntity>
    ) {}

    public signUp = async (signUpDto: SignUpReqDto): Promise<UserEntity> => {
        const newUser = new UserEntity();
        newUser.email = signUpDto.email;
        newUser.password = signUpDto.password;
        newUser.userName = signUpDto.userName;

        await this.userRepository.save(newUser);

        return newUser;
    };

    public findOneByEmail = async (email: string): Promise<UserEntity | null> => {
        return await this.userRepository.findOne({ where: { email } });
    };

    public findOneById = async (userId: number): Promise<UserEntity | null> => {
        return await this.userRepository.findOne({ where: { userId } });
    };
}
