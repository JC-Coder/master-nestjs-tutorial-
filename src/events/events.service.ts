import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./event.entity";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(@InjectRepository(Event) private readonly eventsRepository: Repository<Event>){};
    
    private getEventsBasedQuery(){
        return this.eventsRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
    }

    public async getEvent(id: number): Promise<Event | undefined>{
        const query = await this.getEventsBasedQuery().andWhere('e.id = :id', {id});

        this.logger.debug(query.getSql())
        
        return await query.getOne();
    }
}