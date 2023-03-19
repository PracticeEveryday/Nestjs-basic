import { UserDto } from '@/common/dto/user.dto';
import { PickType } from '@nestjs/swagger';

export class SignUpResDto extends PickType(UserDto, ['email', 'password', 'userName'] as const) {}
