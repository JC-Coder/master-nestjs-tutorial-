import { Controller, Get, Patch, Post, Delete, Param, Body, HttpCode, ValidationPipe, Logger, NotFoundException, Query, UsePipes, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { Attendee } from "./attendee.entity";
import { CreateEventDto } from "./input/create-event.dto";
import { Event } from "./event.entity";
import { EventsService } from "./events.service";
import { UpdateEventDto } from "./input/update-event.dto";
import { ListEvents } from "./input/list.events";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../auth/user.entity";
import { AuthGuardJwt } from "../auth/auth-guard.jwt";

@Controller('events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(@InjectRepository(Event) private readonly repository: Repository<Event>,
    @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService
    ) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))                                                                    
    async findAll(@Query() filter: ListEvents) {
        const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(filter, {
            total: true,
            currentPage: filter.page,
            limit: 2
        });


        return events;
    }

    @Get('/practice')
    async practice() {
        return await this.repository.find({
            select: ['id', 'when'],
            where: [{ 
                id: MoreThan(3),
                when: MoreThan(new Date('2021-02-12T13:00:00'))
            },{
                name: Like('%meet%')
            }],
            take: 2 , // limits the number of data to 2
            order: {
                id: 'DESC'
            }
        })
    }

    @Get('practice2')
    async practice2(){
        // return await this.repository.findOne({
        //     where: {id: 1},
        //     relations: ['attendees']
        // })

        // const event = await this.repository.findOne({
        //     where: {id: 3}
        // });

        const event = new Event();
        event.id = 1;

        const attendee = new Attendee();
        attendee.name = 'Jerry The Second';
        attendee.event = event;

        await this.attendeeRepository.save(event);
        return event

    }

    @Get(':id')
    async findOne(@Param('id') id) {
        const event = await this.eventsService.getEvent(id);

        if(!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    async create(@Body(ValidationPipe) input: CreateEventDto, @CurrentUser() user: User) {
        return await this.eventsService.createEvent(input, user)
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto) {
        const event = await this.repository.findOne({
            where: { id: id }
        })

        if(!event) {
            throw new NotFoundException();
        }

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        })
    }

    @Delete(':id')
    @HttpCode(200)
    async remove(@Param('id') id) {
        const event = await this.repository.findOne({
            where: { id: id }
        });

        if(!event) {
            throw new NotFoundException();
        }

        await this.repository.remove(event);
    }
}