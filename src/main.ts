import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: true, credentials: true });

    app.useGlobalPipes(
        new ValidationPipe({
            //벨리데이션이 끝난 요청 객체를 실제 클래스의 인스턴스로 변환되어 Controller에서 받을 수 있게 됩니다.
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        })
    );

    app.use(cookieParser());
    //ClassSerializerInterceptor 클래스에서 HTTP 응답값을 중간에서 가로채 (Interceptor) class-transformer 의 classToPlain() 함수를 호출하여 JSON 직렬화를 해서 반환합니다.
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    setupSwagger(app);
    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT');

    if (PORT && typeof PORT === 'number') {
        await app.listen(PORT);
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
}

bootstrap();
