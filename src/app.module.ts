import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppService } from './app.service';
import { AppJapanService } from './app.japan.service';
import { ConfigModule } from '@nestjs/config'
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd
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
