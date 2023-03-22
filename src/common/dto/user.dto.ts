import { PickType } from '@nestjs/swagger';

import { UserEntity } from '🔥/database/entity/user.entity';

export class UserDto extends PickType(UserEntity, [
    'userId',
    'email',
    'password',
    'userName',
    'createdAt',
    'updatedAt',
    'deletedAt',
] as const) {}
