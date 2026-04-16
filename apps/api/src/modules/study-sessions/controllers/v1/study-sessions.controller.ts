import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StudySessionEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateStudySessionRequest, UpdateStudySessionRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'Study Sessions' )
@ApiBearerAuth()
@Controller( { path: 'study-sessions', version: '1' } )
export class StudySessionsController {
    constructor( @InjectDataSource() private readonly dataSource: DataSource ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.STUDY_SESSION } )
    @ApiBody( { schema: CreateStudySessionRequest } )
    async create( @Body() createDto: Static<typeof CreateStudySessionRequest>, @AuthenticatedUser() currentUser: any ) {
        const item = this.dataSource.manager.create( StudySessionEntity, { ...createDto, userId: currentUser.id, } );
        const saved = await this.dataSource.manager.save( item );
        return toApiResponse( 'Created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    async findAll( @Query( 'page' ) page: string = '1', @Query( 'limit' ) limit: string = '20', @AuthenticatedUser() currentUser: any ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;
        const where: any = {};
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const [ items, total ] = await this.dataSource.manager.findAndCount( StudySessionEntity, { where, skip, take: limitNum, order: { createdAt: 'DESC' } } );
        return toApiListResponse( items.map( i => serializeEntity( i ) ), total, pageNum, limitNum );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const item = await this.dataSource.manager.findOne( StudySessionEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        return serializeEntity( item );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateStudySessionRequest } )
    async update( @Param( 'id' ) id: string, @Body() updateDto: Static<typeof UpdateStudySessionRequest>, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const item = await this.dataSource.manager.findOne( StudySessionEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        Object.assign( item, updateDto );
        const updated = await this.dataSource.manager.save( item );
        return toApiResponse( 'Updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const item = await this.dataSource.manager.findOne( StudySessionEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        await this.dataSource.manager.softDelete( StudySessionEntity, { id } );
        return toMessageResponse( 'Deleted successfully' );
    }
}
