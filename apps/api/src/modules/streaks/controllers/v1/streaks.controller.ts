import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StreakEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateStreakRequest, UpdateStreakRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';
import { StreaksService } from '../../services';

@ApiTags( 'Streaks' )
@ApiBearerAuth()
@Controller( { path: 'streaks', version: '1' } )
export class StreaksController {
    constructor( 
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly streaksService: StreaksService,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.STREAK } )
    @ApiBody( { schema: CreateStreakRequest } )
    async create( @Body() createDto: Static<typeof CreateStreakRequest>, @AuthenticatedUser() currentUser: any ) {
        const item = this.dataSource.manager.create( StreakEntity, { ...createDto, userId: currentUser.id, } );
        const saved = await this.dataSource.manager.save( item );
        return toApiResponse( 'Created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STREAK } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    async findAll( @Query( 'page' ) page: string = '1', @Query( 'limit' ) limit: string = '20', @AuthenticatedUser() currentUser: any ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;
        const where: any = {};
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const [ items, total ] = await this.dataSource.manager.findAndCount( StreakEntity, { where, skip, take: limitNum, order: { createdAt: 'DESC' } } );
        return toApiListResponse( items.map( i => serializeEntity( i ) ), total, pageNum, limitNum );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STREAK } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const item = await this.dataSource.manager.findOne( StreakEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        return serializeEntity( item );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STREAK } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateStreakRequest } )
    async update( @Param( 'id' ) id: string, @Body() updateDto: Static<typeof UpdateStreakRequest>, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const item = await this.dataSource.manager.findOne( StreakEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        Object.assign( item, updateDto );
        const updated = await this.dataSource.manager.save( item );
        return toApiResponse( 'Updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.STREAK } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };
        if ( currentUser?.role === 'USER' ) { where.userId = currentUser.id; }
        const item = await this.dataSource.manager.findOne( StreakEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        await this.dataSource.manager.softDelete( StreakEntity, { id } );
        return toMessageResponse( 'Deleted successfully' );
    }

    @Get( 'stats/current' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STREAK } )
    async getCurrentStats( @AuthenticatedUser() currentUser: any ) {
        const stats = await this.streaksService.getStreakStats( currentUser.id );
        return toApiResponse( 'Streak stats retrieved', stats );
    }

    @Post( 'activity/track' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STREAK } )
    async trackActivity( @AuthenticatedUser() currentUser: any ) {
        const streak = await this.streaksService.updateStreakForUser( currentUser.id );
        return toApiResponse( 'Activity tracked', serializeEntity( streak ) );
    }

    @Post( 'problems/increment' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STREAK } )
    async incrementProblems( @AuthenticatedUser() currentUser: any ) {
        const streak = await this.streaksService.incrementProblemsSolved( currentUser.id );
        return toApiResponse( 'Problems count incremented', serializeEntity( streak ) );
    }
}
