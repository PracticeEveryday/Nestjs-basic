import { HttpStatus } from '@nestjs/common';

class CustomError extends Error {
    public statusCode: HttpStatus;
    constructor(message: string, statusCode: HttpStatus) {
        super(message);
        this.statusCode = statusCode;
    }
}

export { CustomError };
