import { UserEntity } from '🔥/database/entitys/user.entity';

export interface AuthRepository {
    signUp(user: Partial<UserEntity>): Promise<UserEntity>;
    findOneByEmail(email: string): Promise<UserEntity | null>;
    findOneById(id: number): Promise<UserEntity | null>;
}
