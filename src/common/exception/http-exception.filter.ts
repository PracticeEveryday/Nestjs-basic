import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let statusCode = exception.getStatus();

        let error: unknown;

        if (exception instanceof UnauthorizedException) {
            statusCode = exception.getStatus();
            error = exception.getResponse();
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            error = exception.getResponse();
        } else {
            console.log(exception);
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            error = 'Internal server error';
        }

        const errorResponse = {
            timestamp: new Date(),
            path: request.url,
            method: request.method,
            error: error || null,
        };

        console.log('errorResponse', errorResponse);

        response.status(statusCode).json(errorResponse);
    }
}
