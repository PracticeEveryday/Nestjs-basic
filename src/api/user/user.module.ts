import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';

import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './provoder/user.provider';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule, forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [...userProviders, UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
