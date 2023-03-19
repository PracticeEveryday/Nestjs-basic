import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../api/user/entitys/user.entity';

export class SignInReqDto extends PickType(UserEntity, ['email', 'password'] as const) {}
