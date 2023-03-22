import { UserDto } from '🔥/common/dto/user.dto';

export interface AuthRepository {
    signUp(user: Partial<UserDto>): Promise<UserDto>;
    findOneByEmail(email: string): Promise<UserDto | null>;
    findOneById(id: number): Promise<UserDto | null>;
}
