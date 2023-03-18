import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { SignUpResDto } from './dtos/responst/sign-up.res.dto';
import { UserService } from './user.service';

@Controller('/user')
@ApiTags('User API')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/sign-up')
    @ApiOperation({ summary: '회원 가입' })
    @ApiCreatedResponse({
        description: '회원 가입 성공',
        type: SignUpResDto,
    })
    public async signUp(@Body() signUpDto: SignUpReqDto) {
        return await this.userService.signUp(signUpDto);
    }

    @Post('/sign-in')
    @ApiOperation({ summary: '로그인' })
    // @ApiCreatedResponse({
    //     description: '회원 가입 성공',
    //     type: SignUpResDto,
    // })
    public async signIn(@Body() signInDto: SignInReqDto) {
        return await this.userService.signIn(signInDto);
    }
}
