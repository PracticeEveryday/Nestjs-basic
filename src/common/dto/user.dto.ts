import { UserEntity } from '@/database/entitys/user.entity';
import { PickType } from '@nestjs/swagger';

export class UserDto extends PickType(UserEntity, [
    'userId',
    'email',
    'password',
    'userName',
    'createdAt',
    'updatedAt',
    'deletedAt',
] as const) {}
