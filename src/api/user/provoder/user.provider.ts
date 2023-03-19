import { InjectionToken } from 'src/database/injection.token';
import { DataSource } from 'typeorm';

import { UserEntity } from '🔥/database/entitys/user.entity';

export const userProviders = [
    {
        provide: InjectionToken.USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
        inject: [InjectionToken.MAIN_DATABASE],
    },
];
