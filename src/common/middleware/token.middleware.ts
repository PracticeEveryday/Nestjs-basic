import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '🔥/auth/auth.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        const { refreshToken } = req.cookies;

        if (authorization === undefined) {
            throw new UnauthorizedException('Token 전송 안됨');
        }

        const accessToken = authorization.replace('Bearer ', '');

        const { flag, newAccess, newRefresh } = this.authService.reissueTokenFlow(accessToken, refreshToken);

        if (flag === 3) {
            next();
        } else {
            const maxAge = 9 * 60 * 60 * 1000 * 30;
            const cookie = `refreshToken=${newRefresh}; HttpOnly=true; Path=/auths; Max-Age=${maxAge};`;

            res.setHeader('Set-Cookie', cookie);
            res.status(HttpStatus.OK).json({ newAccess, newRefresh });
        }
    }
}
