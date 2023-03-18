import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectionToken } from 'src/database/injection.token';
import { UserEntity } from '../entitys/user.entity';
import { SignUpReqDto } from '../dtos/request/sign-up.res.dto';

@Injectable()
export class UserRepository {
    constructor(
        @Inject(InjectionToken.USER_REPOSITORY)
        private UserRepository: Repository<UserEntity>
    ) {}

    async signUp(signUpDto: SignUpReqDto): Promise<UserEntity> {
        const newUser = new UserEntity();
        newUser.email = signUpDto.email;
        newUser.password = signUpDto.password;
        newUser.userName = signUpDto.userName;

        await this.UserRepository.save(newUser);

        return newUser;
    }
}
