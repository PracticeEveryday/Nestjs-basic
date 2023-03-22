import { PickType } from '@nestjs/swagger';

import { UserDto } from '🔥/common/dto/user.dto';

export class SignUpReqDto extends PickType(UserDto, ['email', 'password', 'userName'] as const) {}
