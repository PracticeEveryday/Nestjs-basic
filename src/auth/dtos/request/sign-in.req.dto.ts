import { PickType } from '@nestjs/swagger';

import { UserDto } from '🔥/common/dto/user.dto';

export class SignInReqDto extends PickType(UserDto, ['email', 'password'] as const) {}
