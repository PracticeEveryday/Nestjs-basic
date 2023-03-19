import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { SignInResDto } from './dtos/response/sign-in.res.dto';
import { SignUpResDto } from './dtos/response/sign-up.res.dto';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sign-up')
    @ApiOperation({ summary: '회원 가입' })
    @ApiCreatedResponse({
        description: '회원 가입 성공',
        type: SignUpResDto,
    })
    public async signUp(@Body() signUpDto: SignUpReqDto): Promise<SignUpResDto> {
        return await this.authService.signUp(signUpDto);
    }

    @Post('/sign-in')
    @ApiOperation({ summary: '로그인' })
    @ApiCreatedResponse({
        description: '회원 가입 성공',
        type: SignInResDto,
    })
    public async signIn(@Body() signInDto: SignInReqDto): Promise<SignInResDto> {
        return await this.authService.signIn(signInDto);
    }
}
