import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';

import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { userProviders } from '@/api/user/provoder/user.provider';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [
        PassportModule,
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const privateKey = configService.get<string>('JWT_PRIVATE_KEY') || '';
                return { privateKey };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, JwtStrategy, AuthRepository, ...userProviders],
    controllers: [AuthController],
})
export class AuthModule {}
