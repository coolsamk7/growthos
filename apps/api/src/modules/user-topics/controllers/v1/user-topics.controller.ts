import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserTopicEntity } from '@growthos/nestjs-database/entities';
import { TopicStatus } from '@growthos/nestjs-shared';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateUserTopicRequest, UpdateUserTopicRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags('User Topics')
@ApiBearerAuth()
@Controller({ path: 'user-topics', version: '1' })
export class UserTopicsController {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.CREATE, subject: Subject.USER_TOPIC })
    @ApiBody({ schema: CreateUserTopicRequest })
    async create(@Body() createDto: Static<typeof CreateUserTopicRequest>, @AuthenticatedUser() currentUser: any) {
        const item = this.dataSource.manager.create(UserTopicEntity, { 
            ...createDto,
            status: (createDto.status as TopicStatus) || TopicStatus.NOT_STARTED,
        });
        const saved = await this.dataSource.manager.save(item);
        return toApiResponse('Created successfully', serializeEntity(saved));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.READ, subject: Subject.USER_TOPIC })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20', @AuthenticatedUser() currentUser: any) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where: any = {};// No userId filter for this entity
        const [items, total] = await this.dataSource.manager.findAndCount(UserTopicEntity, { where, skip, take: limitNum, order: { createdAt: 'DESC' } });
        return toApiListResponse(items.map(i => serializeEntity(i)), total, pageNum, limitNum);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.READ, subject: Subject.USER_TOPIC })
    @ApiParam({ name: 'id', type: String })
    async findOne(@Param('id') id: string, @AuthenticatedUser() currentUser: any) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne(UserTopicEntity, { where });
        if (!item) throw new NotFoundException({ message: 'Not found' });
        return serializeEntity(item);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.UPDATE, subject: Subject.USER_TOPIC })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ schema: UpdateUserTopicRequest })
    async update(@Param('id') id: string, @Body() updateDto: Static<typeof UpdateUserTopicRequest>, @AuthenticatedUser() currentUser: any) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne(UserTopicEntity, { where });
        if (!item) throw new NotFoundException({ message: 'Not found' });
        Object.assign(item, updateDto);
        const updated = await this.dataSource.manager.save(item);
        return toApiResponse('Updated successfully', serializeEntity(updated));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.DELETE, subject: Subject.USER_TOPIC })
    @ApiParam({ name: 'id', type: String })
    async delete(@Param('id') id: string, @AuthenticatedUser() currentUser: any) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne(UserTopicEntity, { where });
        if (!item) throw new NotFoundException({ message: 'Not found' });
        await this.dataSource.manager.softDelete(UserTopicEntity, { id });
        return toMessageResponse('Deleted successfully');
    }
}
