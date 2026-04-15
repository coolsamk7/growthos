import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MasterProblemEntity } from '@growthos/nestjs-database/entities';
import { Difficulty, ProblemSource } from '@growthos/nestjs-shared';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateMasterProblemRequest, UpdateMasterProblemRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'Master Problems' )
@ApiBearerAuth()
@Controller( { path: 'master-problems', version: '1' } )
export class MasterProblemsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.MASTER_PROBLEM } )
    @ApiBody( { schema: CreateMasterProblemRequest } )
    async create( @Body() createDto: Static<typeof CreateMasterProblemRequest> ) {
        const problem = this.dataSource.manager.create( MasterProblemEntity, {
            ...createDto,
            difficulty: createDto.difficulty as Difficulty,
            source: ( createDto.source as ProblemSource ) || ProblemSource.LEETCODE,
            orderIndex: createDto.orderIndex || 0,
            isPublished: createDto.isPublished ?? true,
            isMustSolve: createDto.isMustSolve ?? false,
        } );

        const saved = await this.dataSource.manager.save( problem );

        return toApiResponse( 'Master problem created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_PROBLEM } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'masterTopicId', required: false, type: String } )
    @ApiQuery( { name: 'difficulty', required: false, type: String } )
    @ApiQuery( { name: 'isPublished', required: false, type: Boolean } )
    async findAll(
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @Query( 'masterTopicId' ) masterTopicId?: string,
        @Query( 'difficulty' ) difficulty?: string,
        @Query( 'isPublished' ) isPublished?: string,
        @AuthenticatedUser() currentUser?: any
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        const whereConditions: any = {};
        
        if ( masterTopicId ) {
            whereConditions.masterTopicId = masterTopicId;
        }

        if ( difficulty ) {
            whereConditions.difficulty = difficulty;
        }

        // Regular users can only see published problems
        if ( currentUser?.role === 'USER' ) {
            whereConditions.isPublished = true;
        } else if ( isPublished !== undefined ) {
            whereConditions.isPublished = isPublished === 'true';
        }

        const [ problems, total ] = await this.dataSource.manager.findAndCount( MasterProblemEntity, {
            where: whereConditions,
            skip,
            take: limitNum,
            order: { orderIndex: 'ASC', createdAt: 'DESC' },
        } );

        return toApiListResponse(
            problems.map( p => serializeEntity( p ) ),
            total,
            pageNum,
            limitNum
        );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_PROBLEM } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser?: any ) {
        const problem = await this.dataSource.manager.findOne( MasterProblemEntity, { 
            where: { id } 
        } );

        if ( !problem ) {
            throw new NotFoundException( { message: 'Master problem not found' } );
        }

        // Regular users can only view published problems
        if ( currentUser?.role === 'USER' && !problem.isPublished ) {
            throw new NotFoundException( { message: 'Master problem not found' } );
        }

        return serializeEntity( problem );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.MASTER_PROBLEM } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateMasterProblemRequest } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateMasterProblemRequest>
    ) {
        const problem = await this.dataSource.manager.findOne( MasterProblemEntity, { 
            where: { id } 
        } );

        if ( !problem ) {
            throw new NotFoundException( { message: 'Master problem not found' } );
        }

        Object.assign( problem, {
            ...updateDto,
            difficulty: updateDto.difficulty ? updateDto.difficulty as Difficulty : problem.difficulty,
            source: updateDto.source ? updateDto.source as ProblemSource : problem.source,
        } );

        const updated = await this.dataSource.manager.save( problem );

        return toApiResponse( 'Master problem updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.MASTER_PROBLEM } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string ) {
        const problem = await this.dataSource.manager.findOne( MasterProblemEntity, { 
            where: { id } 
        } );

        if ( !problem ) {
            throw new NotFoundException( { message: 'Master problem not found' } );
        }

        await this.dataSource.manager.softDelete( MasterProblemEntity, { id } );

        return toMessageResponse( 'Master problem deleted successfully' );
    }
}
