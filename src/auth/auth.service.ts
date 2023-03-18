import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async signToken(userId: number): Promise<string> {
        const payload = { userId };
        const token = this.jwtService.sign(payload);

        return token;
    }
}
