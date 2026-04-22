import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ResourceEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateResourceRequest, UpdateResourceRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'Resources' )
@ApiBearerAuth()
@Controller( { path: 'resources', version: '1' } )
export class ResourcesController {
    constructor( @InjectDataSource() private readonly dataSource: DataSource ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.RESOURCE } )
    @ApiBody( { schema: CreateResourceRequest } )
    async create( @Body() createDto: Static<typeof CreateResourceRequest>, @AuthenticatedUser() currentUser: any ) {
        const item = this.dataSource.manager.create( ResourceEntity, { ...createDto,  } );
        const saved = await this.dataSource.manager.save( item );
        return toApiResponse( 'Created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.RESOURCE } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    async findAll( @Query( 'page' ) page: string = '1', @Query( 'limit' ) limit: string = '20', @AuthenticatedUser() currentUser: any ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;
        const where: any = {};// No userId filter for this entity
        const [ items, total ] = await this.dataSource.manager.findAndCount( ResourceEntity, { where, skip, take: limitNum, order: { createdAt: 'DESC' } } );
        return toApiListResponse( items.map( i => serializeEntity( i ) ), total, pageNum, limitNum );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.RESOURCE } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne( ResourceEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        return serializeEntity( item );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.RESOURCE } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateResourceRequest } )
    async update( @Param( 'id' ) id: string, @Body() updateDto: Static<typeof UpdateResourceRequest>, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne( ResourceEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        Object.assign( item, updateDto );
        const updated = await this.dataSource.manager.save( item );
        return toApiResponse( 'Updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.RESOURCE } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id };// No userId filter for this entity
        const item = await this.dataSource.manager.findOne( ResourceEntity, { where } );
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        await this.dataSource.manager.softDelete( ResourceEntity, { id } );
        return toMessageResponse( 'Deleted successfully' );
    }
}
