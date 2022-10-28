import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../auth/profile.entity';
import { User } from '../auth/user.entity';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
    imports: [TypeOrmModule.forFeature([Event, Attendee, User, Profile])],
    controllers: [EventsController],
    providers: [EventsService]
})
export class EventsModule {}
