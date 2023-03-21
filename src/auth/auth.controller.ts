import { Body, Controller, Inject, LoggerService, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AuthService } from './auth.service';
import { SignInReqDto } from './dtos/request/sign-in.req.dto';
import { SignUpReqDto } from './dtos/request/sign-up.req.dto';
import { SignInResDto } from './dtos/response/sign-in.res.dto';
import { SignUpResDto } from './dtos/response/sign-up.res.dto';
import { CustomAuthGuard } from './guard/custom-auth.guard';

@Controller('auths')
@ApiTags('Auth API')
export class AuthController {
    constructor(private authService: AuthService, @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

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
        this.logger.log('로그인 로그!');
        return await this.authService.signIn(signInDto);
    }

    @Post('/guard-test')
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    public async guardTest() {
        this.logger.log('가드테스트!');
        return 'test';
    }
}
