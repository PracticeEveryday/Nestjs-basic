export class UserDomain {
    constructor(
        public readonly userId: number,
        public readonly userName: string,
        public readonly email: string,
        public readonly password: string
    ) {}
}

export interface AuthRepository {
    signUp(user: UserDomain): Promise<UserDomain>;
    findOneByEmail(email: string): Promise<UserDomain | null>;
    findOneById(id: number): Promise<UserDomain | null>;
}
