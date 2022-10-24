import { Module } from '@nestjs/common';
import { EventsController } from './events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import { AppService } from './app.service';
import { AppJapanService } from './app.japan.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nest-events',
    entities: [Event],
    synchronize: true
  }),
  EventsModule
],
  controllers: [],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService
    },
    {
      provide: 'APP_NAME',
      useValue: 'Nest Events Backend'
    }
  ],
})
export class AppModule {}
