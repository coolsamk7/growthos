import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MasterLearningPathEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateMasterLearningPathRequest, UpdateMasterLearningPathRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'Master Learning Paths' )
@ApiBearerAuth()
@Controller( { path: 'master-learning-paths', version: '1' } )
export class MasterLearningPathsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.MASTER_LEARNING_PATH } )
    async create( @Body() createDto: Static<typeof CreateMasterLearningPathRequest> ) {
        const path = this.dataSource.manager.create( MasterLearningPathEntity, {
            ...createDto,
            isPublished: createDto.isPublished ?? true,
            adoptionCount: 0,
        } );

        const saved = await this.dataSource.manager.save( path );
        return toApiResponse( 'Master learning path created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_LEARNING_PATH } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'isPublished', required: false, type: Boolean } )
    async findAll(
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @Query( 'isPublished' ) isPublished?: string,
        @AuthenticatedUser() currentUser?: any
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        const whereConditions: any = {};
        
        if ( currentUser?.role === 'USER' ) {
            whereConditions.isPublished = true;
        } else if ( isPublished !== undefined ) {
            whereConditions.isPublished = isPublished === 'true';
        }

        const [ paths, total ] = await this.dataSource.manager.findAndCount( MasterLearningPathEntity, {
            where: whereConditions,
            skip,
            take: limitNum,
            order: { adoptionCount: 'DESC', createdAt: 'DESC' },
        } );

        return toApiListResponse(
            paths.map( p => serializeEntity( p ) ),
            total,
            pageNum,
            limitNum
        );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser?: any ) {
        const path = await this.dataSource.manager.findOne( MasterLearningPathEntity, { where: { id } } );

        if ( !path ) {
            throw new NotFoundException( { message: 'Master learning path not found' } );
        }

        if ( currentUser?.role === 'USER' && !path.isPublished ) {
            throw new NotFoundException( { message: 'Master learning path not found' } );
        }

        return serializeEntity( path );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.MASTER_LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateMasterLearningPathRequest>
    ) {
        const path = await this.dataSource.manager.findOne( MasterLearningPathEntity, { where: { id } } );

        if ( !path ) {
            throw new NotFoundException( { message: 'Master learning path not found' } );
        }

        Object.assign( path, updateDto );
        const updated = await this.dataSource.manager.save( path );

        return toApiResponse( 'Master learning path updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.MASTER_LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string ) {
        const path = await this.dataSource.manager.findOne( MasterLearningPathEntity, { where: { id } } );

        if ( !path ) {
            throw new NotFoundException( { message: 'Master learning path not found' } );
        }

        await this.dataSource.manager.softDelete( MasterLearningPathEntity, { id } );
        return toMessageResponse( 'Master learning path deleted successfully' );
    }
}
