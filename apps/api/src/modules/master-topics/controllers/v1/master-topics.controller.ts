import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MasterTopicEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateMasterTopicRequest, UpdateMasterTopicRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'Master Topics' )
@ApiBearerAuth()
@Controller( { path: 'master-topics', version: '1' } )
export class MasterTopicsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.MASTER_TOPIC } )
    async create( @Body() createDto: Static<typeof CreateMasterTopicRequest> ) {
        const topic = this.dataSource.manager.create( MasterTopicEntity, {
            ...createDto,
            orderIndex: createDto.orderIndex || 0,
            isPublished: createDto.isPublished ?? true,
        } );

        const saved = await this.dataSource.manager.save( topic );
        return toApiResponse( 'Master topic created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_TOPIC } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'masterLearningPathId', required: false, type: String } )
    @ApiQuery( { name: 'isPublished', required: false, type: Boolean } )
    async findAll(
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @Query( 'masterLearningPathId' ) masterLearningPathId?: string,
        @Query( 'isPublished' ) isPublished?: string,
        @AuthenticatedUser() currentUser?: any
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        const whereConditions: any = {};
        
        if ( masterLearningPathId ) {
            whereConditions.masterLearningPathId = masterLearningPathId;
        }

        if ( currentUser?.role === 'USER' ) {
            whereConditions.isPublished = true;
        } else if ( isPublished !== undefined ) {
            whereConditions.isPublished = isPublished === 'true';
        }

        const [ topics, total ] = await this.dataSource.manager.findAndCount( MasterTopicEntity, {
            where: whereConditions,
            skip,
            take: limitNum,
            order: { orderIndex: 'ASC', createdAt: 'DESC' },
        } );

        return toApiListResponse(
            topics.map( t => serializeEntity( t ) ),
            total,
            pageNum,
            limitNum
        );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_TOPIC } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser?: any ) {
        const topic = await this.dataSource.manager.findOne( MasterTopicEntity, { where: { id } } );

        if ( !topic ) {
            throw new NotFoundException( { message: 'Master topic not found' } );
        }

        if ( currentUser?.role === 'USER' && !topic.isPublished ) {
            throw new NotFoundException( { message: 'Master topic not found' } );
        }

        return serializeEntity( topic );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.MASTER_TOPIC } )
    @ApiParam( { name: 'id', type: String } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateMasterTopicRequest>
    ) {
        const topic = await this.dataSource.manager.findOne( MasterTopicEntity, { where: { id } } );

        if ( !topic ) {
            throw new NotFoundException( { message: 'Master topic not found' } );
        }

        Object.assign( topic, updateDto );
        const updated = await this.dataSource.manager.save( topic );

        return toApiResponse( 'Master topic updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.MASTER_TOPIC } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string ) {
        const topic = await this.dataSource.manager.findOne( MasterTopicEntity, { where: { id } } );

        if ( !topic ) {
            throw new NotFoundException( { message: 'Master topic not found' } );
        }

        await this.dataSource.manager.softDelete( MasterTopicEntity, { id } );
        return toMessageResponse( 'Master topic deleted successfully' );
    }
}
