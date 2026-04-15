import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserProblemEntity } from '@growthos/nestjs-database/entities';
import { Difficulty, ProblemStatus, ProblemSource } from '@growthos/nestjs-shared';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateUserProblemRequest, UpdateUserProblemRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags('User Problems')
@ApiBearerAuth()
@Controller({ path: 'user-problems', version: '1' })
export class UserProblemsController {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.CREATE, subject: Subject.USER_PROBLEM })
    @ApiBody({ schema: CreateUserProblemRequest })
    async create(@Body() createDto: Static<typeof CreateUserProblemRequest>, @AuthenticatedUser() currentUser: any) {
        const item = this.dataSource.manager.create(UserProblemEntity, { 
            ...createDto,
            difficulty: createDto.difficulty as Difficulty,
            status: (createDto.status as ProblemStatus) || ProblemStatus.TODO,
            source: (createDto.source as ProblemSource) || ProblemSource.LEETCODE,
        });
        const saved = await this.dataSource.manager.save(item);
        return toApiResponse('Created successfully', serializeEntity(saved));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.READ, subject: Subject.USER_PROBLEM })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20', @AuthenticatedUser() currentUser: any) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where: any = {};// No userId filter for this entity
        const [items, total] = await this.dataSource.manager.findAndCount(UserProblemEntity, { where, skip, take: limitNum, order: { createdAt: 'DESC' } });
        return toApiListResponse(items.map(i => serializeEntity(i)), total, pageNum, limitNum);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.READ, subject: Subject.USER_PROBLEM })
    @ApiParam({ name: 'id', type: String })
    async findOne(@Param('id') id: string, @AuthenticatedUser() currentUser: any) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne(UserProblemEntity, { where });
        if (!item) throw new NotFoundException({ message: 'Not found' });
        return serializeEntity(item);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.UPDATE, subject: Subject.USER_PROBLEM })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ schema: UpdateUserProblemRequest })
    async update(@Param('id') id: string, @Body() updateDto: Static<typeof UpdateUserProblemRequest>, @AuthenticatedUser() currentUser: any) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne(UserProblemEntity, { where });
        if (!item) throw new NotFoundException({ message: 'Not found' });
        Object.assign(item, updateDto);
        const updated = await this.dataSource.manager.save(item);
        return toApiResponse('Updated successfully', serializeEntity(updated));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.DELETE, subject: Subject.USER_PROBLEM })
    @ApiParam({ name: 'id', type: String })
    async delete(@Param('id') id: string, @AuthenticatedUser() currentUser: any) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne(UserProblemEntity, { where });
        if (!item) throw new NotFoundException({ message: 'Not found' });
        await this.dataSource.manager.softDelete(UserProblemEntity, { id });
        return toMessageResponse('Deleted successfully');
    }
}
