import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
    // ['X-Api-Key', 'jwt']

    constructor(private jwtService: JwtService, private configService: ConfigService) {
        super();
    }

    override canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers;

        if (authorization === undefined) {
            throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
        }

        const token = authorization.replace('Bearer ', '');
        request.user = this.validateToken(token);
        return true;

        // return super.canActivate(context);
    }

    validateToken(token: string) {
        const secretKey = this.configService.get<string>('JWT_PRIVATE_KEY') || '';

        try {
            const verify = this.jwtService.verify(token, { secret: secretKey });
            return verify;
        } catch (e: unknown) {
            if (e instanceof JsonWebTokenError) {
                console.log(e.message, 'message');
                switch (e.message) {
                    // 토큰에 대한 오류를 판단합니다.
                    case 'invalid signature':
                        throw new HttpException(`유효하지 않은 토큰입니다.: ${e.message}`, 401);
                    case 'jwt malformed':
                        throw new HttpException(`유효하지 않은 토큰입니다.: ${e.message}`, 401);
                    case 'jwt expired':
                        throw new HttpException(`토큰이 만료되었습니다.: ${e.message}`, 410);
                    default:
                        throw new HttpException(`서버 오류입니다.: ${e.message}`, 500);
                }
            }
        }
    }

    override handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('해당 userId의 유저가 존재하지 않습니다.');
        }
        return user;
    }
}
