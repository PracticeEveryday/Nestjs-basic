import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './provoder/user.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [...userProviders, UserService],
})
export class UserModule {}
