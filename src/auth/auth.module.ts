import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from './auth.service';

@Module({
    imports: [DatabaseModule],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
