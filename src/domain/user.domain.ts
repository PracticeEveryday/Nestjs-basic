export class UserDomain {
    constructor(
        public readonly userId: number,
        public readonly userName: string,
        public readonly email: string,
        public readonly password: string
    ) {}
}

export interface UserInterface {
    readonly userId: number;
    readonly userName: string;
    readonly email: string;
    readonly password: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}

export interface AuthRepository {
    signUp(user: Partial<UserInterface>): Promise<UserInterface>;
    findOneByEmail(email: string): Promise<UserInterface | null>;
    findOneById(id: number): Promise<UserInterface | null>;
}
