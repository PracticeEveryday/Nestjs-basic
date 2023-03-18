import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './api/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`config/.env.${process.env['NODE_ENV'] || 'local'}`],
            isGlobal: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test', 'local').default('prod'),
                PORT: Joi.number().default(8082),
                MONGO_URI: Joi.string(),
                JWT_SECRET: Joi.string(),
                SWAGGER_USER: Joi.string(),
                SWAGGER_PASSWORD: Joi.string(),
                REDIS_HOST: Joi.string(),
                REDIS_PORT: Joi.number(),
            }),
        }),
        AuthModule,
        DatabaseModule,
        UserModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
