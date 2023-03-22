import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '🔥/auth/auth.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    use(req: Request, _res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        const { refreshToken } = req.cookies;

        if (authorization === undefined) {
            throw new UnauthorizedException('Token 전송 안됨');
        }

        const accessToken = authorization.replace('Bearer ', '');

        const validation = this.authService.validateToken(refreshToken);
        const validation2 = this.authService.validateToken(accessToken);
        console.log(validation, validation2);

        next();
    }
}
