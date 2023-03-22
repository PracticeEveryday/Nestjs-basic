import { Body, Controller, Inject, LoggerService, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiCookieAuth, ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
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
        description: '로그인 성공',
        type: SignInResDto,
    })
    @ApiResponse({
        status: 200,
        description: '성공 시 Set-Cookie Header에 RefreshToken이 들어 있습니다.',
        headers: {
            'Set-Cookie': {
                description: 'Set-Cookie header',
                schema: {
                    type: 'string',
                },
            },
        },
    })
    public async signIn(@Body() signInDto: SignInReqDto, @Res() res: Response) {
        this.logger.log('로그인 로그!');

        const { refreshToken, accessToken } = await this.authService.signIn(signInDto);
        const maxAge = 9 * 60 * 60 * 1000 * 30;
        const cookie = `refreshToken=${refreshToken}; HttpOnly=true; Path=/auths; Max-Age=${maxAge};`;
        res.setHeader('Set-Cookie', cookie);

        res.send({ accessToken });
    }

    @Post('/guard-test')
    @ApiBearerAuth()
    @ApiCookieAuth()
    @UseGuards(CustomAuthGuard)
    public async guardTest(@Req() req: Request) {
        this.logger.log('가드테스트!');
        return { cookies: req.cookies };
    }
}
