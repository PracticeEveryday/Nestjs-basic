import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as fs from 'fs';
import basicAuth from 'express-basic-auth';

export function setupSwagger(app: INestApplication): void {
    const SWAGGER_USER = process.env['SWAGGER_USER'] as string;

    app.use(
        ['/api-docs'],
        basicAuth({
            challenge: true,
            users: {
                [SWAGGER_USER]: process.env['SWAGGER_PASSWORD'] as string,
            },
        })
    );

    const swaggerInfo = fs.readFileSync('swagger-info.md', 'utf-8');

    const options = new DocumentBuilder()
        .setTitle('nestjs-startkit')
        .setDescription(swaggerInfo)
        .setVersion('0.0.1')
        .addBearerAuth(
            {
                description: '인증서버에서 받은 accessToken을 집어넣어주세요',
                name: 'Authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'accessToken'
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
}
