export class UserDomain {
    constructor(
        public readonly userId: number,
        public readonly userName: string,
        public readonly email: string,
        public readonly password: string
    ) {}
}
