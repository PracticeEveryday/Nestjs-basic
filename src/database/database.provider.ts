import { DataSource } from 'typeorm';
import { InjectionToken } from './injection.token';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseProviders = [
    {
        provide: InjectionToken.MAIN_DATABASE,
        imports: [ConfigModule],
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
                // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
                namingStrategy: new SnakeNamingStrategy(),
            });

            return dataSource.initialize();
        },
    },
];
