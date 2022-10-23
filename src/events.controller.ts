import { Controller, Get, Patch, Post, Delete, Param, Body, HttpCode } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { CreateEventDto } from "./create-event.dto";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./update-event.dto";

@Controller('events')
export class EventsController {
    constructor(@InjectRepository(Event) private readonly repository: Repository<Event>) { }

    @Get()
    async findAll() {
        return await this.repository.find();
    }

    @Get('/practice')
    async practice() {
        return await this.repository.find({
            where: { 
                id: MoreThan(3),
                when: MoreThan(new Date('2021-02-12T13:00:00'))
            }
        })
    }

    @Get(':id')
    async findOne(@Param('id') id) {
        return await this.repository.findOne({
            where: { id: id }
        })
    }

    @Post()
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when)
        })
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto) {
        const event = await this.repository.findOne({
            where: { id: id }
        })

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

        await this.repository.remove(event);
    }
}