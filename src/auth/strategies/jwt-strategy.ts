import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

export type CustomPayload = JwtPayload & {
    userId: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, @Inject(AuthService) private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_PRIVATE_KEY'),
        });
    }

    async validate(payload: CustomPayload) {
        const { userId } = payload;
        const user = await this.authService.findOneById(userId);
        if (!user) throw new UnauthorizedException('해당 userId의 유저가 존재하지 않습니다.');

        return user;
    }
}
