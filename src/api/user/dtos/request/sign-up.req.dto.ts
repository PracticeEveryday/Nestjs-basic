import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../entitys/user.entity';

export class SignUpReqDto extends PickType(UserEntity, ['email', 'password', 'userName'] as const) {}
