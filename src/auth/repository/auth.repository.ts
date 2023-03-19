import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectionToken } from 'src/database/injection.token';
import { UserEntity } from '../../api/user/entitys/user.entity';
import { SignUpReqDto } from '../dtos/request/sign-up.req.dto';

@Injectable()
export class AuthRepository {
    constructor(
        @Inject(InjectionToken.USER_REPOSITORY)
        private authRepository: Repository<UserEntity>
    ) {}

    public signUp = async (signUpDto: SignUpReqDto): Promise<UserEntity> => {
        const newUser = new UserEntity();
        newUser.email = signUpDto.email;
        newUser.password = signUpDto.password;
        newUser.userName = signUpDto.userName;

        await this.authRepository.save(newUser);

        return newUser;
    };

    public findOneByEmail = async (email: string): Promise<UserEntity | null> => {
        return await this.authRepository.findOne({ where: { email } });
    };

    public findOneById = async (userId: number): Promise<UserEntity | null> => {
        return await this.authRepository.findOne({ where: { userId } });
    };
}
