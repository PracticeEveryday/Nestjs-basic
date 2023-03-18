import { Injectable } from '@nestjs/common';
import { SignUpReqDto } from './dtos/request/sign-up.res.dto';
import { UserEntity } from './entitys/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async signUp(signUpDto: SignUpReqDto): Promise<UserEntity> {
        return await this.userRepository.signUp(signUpDto);
    }
}
