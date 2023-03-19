// library
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

// payload
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
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
        const user = this.authService.findOneById(userId);

        if (!user) throw new UnauthorizedException();

        return user;
    }
}
