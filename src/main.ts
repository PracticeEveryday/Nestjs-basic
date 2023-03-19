import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: true, credentials: true });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        })
    );

    setupSwagger(app);

    const PORT = process.env['PORT'];
    if (PORT && typeof PORT === 'string') {
        await app.listen(PORT);
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
}

bootstrap();
