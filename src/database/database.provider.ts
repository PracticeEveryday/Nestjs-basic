import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { UserEntity } from './entity/user.entity';
import { InjectionToken } from './injection.token';

export const databaseProviders: Provider[] = [
    {
        provide: InjectionToken.MAIN_DATABASE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const host = configService.get<string>('DB_HOST') || '';
            const username = configService.get<string>('DB_USER') || '';
            const password = configService.get<string>('DB_PASSWORD') || '';
            const database = configService.get<string>('DB_DB') || '';

            const dataSource = new DataSource({
                type: 'mysql',
                host,
                port: 3306,
                username,
                password,
                database,
                entities: [UserEntity],
                synchronize: true,
                namingStrategy: new SnakeNamingStrategy(),
            });

            return dataSource.initialize();
        },
    },
];
