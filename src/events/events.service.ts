import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event } from "./event.entity";
import { ListEvents, WhenEventFilter } from "./input/list.events";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(@InjectRepository(Event) private readonly eventsRepository: Repository<Event>){};
    
    private getEventsBasedQuery(){
        return this.eventsRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
    }

    public getEventsWithAttendeeCountQuery(){
        return this.getEventsBasedQuery()
        .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
        .loadRelationCountAndMap('e.attendeeAccepted', 'e.attendees', 'attendee', 
        (qb) => qb.where('attendee.answer = :answer' , {answer: AttendeeAnswerEnum.Accepted})
        )
        .loadRelationCountAndMap('e.attendeeMaybe', 'e.attendees', 'attendee', 
        (qb) => qb.where('attendee.answer = :answer' , {answer: AttendeeAnswerEnum.Maybe})
        )
        .loadRelationCountAndMap('e.attendeeRejected', 'e.attendees', 'attendee', 
        (qb) => qb.where('attendee.answer = :answer' , {answer: AttendeeAnswerEnum.Rejected})
        )
    }

    public async getEventsWithAttendeeCountFiltered(filter?: ListEvents){
        let query = this.getEventsWithAttendeeCountQuery();

        if(!filter){
            return  await query.getMany();
        }

        if(filter.when){
            if(filter.when == WhenEventFilter.Today){
                query = query.andWhere(`e.when >= CURRENT_DATE AND e.when <= CURRENT_DATE + 1`);
            }


            if(filter.when == WhenEventFilter.Tomorrow){
                query = query.andWhere(`e.when >=  CURRENT_DATE + 1  AND e.when <=  CURRENT_DATE + 2`);
            }

            if(filter.when == WhenEventFilter.ThisWeek){
                query = query.andWhere(`extract(week from e.when) = extract(week from CURRENT_DATE)`);
            }

            if(filter.when == WhenEventFilter.NextWeek){
                query = query.andWhere(`extract(week from e.when) = extract(week from current_date) + 1`);
            }

        }

        return await query.getMany();


    }

    public async getEvent(id: number): Promise<Event | undefined>{
        const query = await this.getEventsWithAttendeeCountQuery().andWhere('e.id = :id', {id});

        this.logger.debug(query.getSql())
        
        return await query.getOne();
    }
}