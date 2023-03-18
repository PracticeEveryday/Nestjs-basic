import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpReqDto } from './dtos/request/sign-up.res.dto';
import { SignUpResDto } from './dtos/responst/sign-up.res.dto';
import { UserService } from './user.service';

@Controller('/user')
@ApiTags('User API')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/')
    @ApiOperation({ summary: '회원 가입' })
    @ApiCreatedResponse({
        description: '회원 가입 성공',
        type: SignUpResDto,
    })
    async signUp(@Body() signUpDto: SignUpReqDto) {
        return await this.userService.signUp(signUpDto);
    }
}
