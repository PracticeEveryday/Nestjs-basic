import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    Inject,
    LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let statusCode = exception.getStatus();
        let error: any;

        if (exception instanceof UnauthorizedException) {
            statusCode = exception.getStatus();
            error = exception.getResponse();
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            error = exception.getResponse();
        } else {
            console.error('exception', exception);
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            error = 'Internal server error';
        }

        const errorResponse = {
            timestamp: new Date(),
            path: request.url,
            method: request.method,
            error: error || null,
        };
        this.logger.error(`${errorResponse.timestamp}: [${errorResponse.method} ${errorResponse.path}] ${errorResponse.error['message']}`);
        console.error('errorResponse', errorResponse);

        response.status(statusCode).json(errorResponse);
    }
}
