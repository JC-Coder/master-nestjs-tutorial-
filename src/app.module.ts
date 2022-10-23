import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

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
  TypeOrmModule.forFeature([Event])
],
  controllers: [EventsController],
  providers: [],
})
export class AppModule {}
