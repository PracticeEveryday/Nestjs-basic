import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
    // ['X-Api-Key', 'jwt']

    constructor(private authService: AuthService) {
        super();
    }

    override canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers;

        if (authorization === undefined) {
            throw new UnauthorizedException('Token 전송 안됨');
        }

        const token = authorization.replace('Bearer ', '');
        request.user = this.authService.validateToken(token);
        return true;
    }

    override handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('해당 userId의 유저가 존재하지 않습니다.');
        }
        return user;
    }
}
