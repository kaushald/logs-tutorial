import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { ArtifactModule } from './artifact/artifact.module';
import { PotionModule } from './potion/potion.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: {
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: true,
                    singleLine: true,
                  },
                }
              : {
                  target: 'pino-socket',
                  options: {
                    mode: 'tcp',
                    address: 'localhost',
                    port: 5044,
                  },
                },
        },
      }),
    }),
    BookingModule,
    ArtifactModule,
    PotionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
