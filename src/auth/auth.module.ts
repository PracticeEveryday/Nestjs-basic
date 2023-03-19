import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '🔥/database/database.module';
import { userProviders } from '🔥/user/provider/user.provider';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepositoryImpl } from './repository/auth.repository';
import { JwtStrategy } from './strategies/jwt-strategy';

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
    providers: [AuthService, JwtStrategy, AuthRepositoryImpl, ...userProviders],
    controllers: [AuthController],
})
export class AuthModule {}
