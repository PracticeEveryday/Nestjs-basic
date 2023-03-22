export class UserDomain {
    constructor(
        public readonly userId: number,
        public readonly userName: string,
        public readonly email: string,
        public readonly password: string
    ) {}
}

export interface User {
    readonly userId: number;
    readonly userName: string;
    readonly email: string;
    readonly password: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}

export interface AuthRepository {
    signUp(user: Partial<User>): Promise<User>;
    findOneByEmail(email: string): Promise<User | null>;
    findOneById(id: number): Promise<User | null>;
}
