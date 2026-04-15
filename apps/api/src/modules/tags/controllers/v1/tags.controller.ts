import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TagEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateTagRequest, UpdateTagRequest } from '../../dtos';

@ApiTags( 'Tags' )
@ApiBearerAuth()
@Controller( { path: 'tags', version: '1' } )
export class TagsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.TAG } )
    @ApiBody( { schema: CreateTagRequest } )
    async create( @Body() createDto: Static<typeof CreateTagRequest> ) {
        const existing = await this.dataSource.manager.findOne( TagEntity, {
            where: { name: createDto.name }
        } );

        if ( existing ) {
            throw new BadRequestException( { message: 'Tag with this name already exists' } );
        }

        const tag = this.dataSource.manager.create( TagEntity, createDto );
        const saved = await this.dataSource.manager.save( tag );

        return toApiResponse( 'Tag created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.TAG } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'category', required: false, type: String } )
    async findAll(
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @Query( 'category' ) category?: string
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        const whereConditions: any = {};
        if ( category ) {
            whereConditions.category = category;
        }

        const [ tags, total ] = await this.dataSource.manager.findAndCount( TagEntity, {
            where: whereConditions,
            skip,
            take: limitNum,
            order: { name: 'ASC' },
        } );

        return toApiListResponse(
            tags.map( tag => serializeEntity( tag ) ),
            total,
            pageNum,
            limitNum
        );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.TAG } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string ) {
        const tag = await this.dataSource.manager.findOne( TagEntity, { where: { id } } );

        if ( !tag ) {
            throw new NotFoundException( { message: 'Tag not found' } );
        }

        return serializeEntity( tag );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.TAG } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateTagRequest } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateTagRequest>
    ) {
        const tag = await this.dataSource.manager.findOne( TagEntity, { where: { id } } );

        if ( !tag ) {
            throw new NotFoundException( { message: 'Tag not found' } );
        }

        if ( updateDto.name && updateDto.name !== tag.name ) {
            const existing = await this.dataSource.manager.findOne( TagEntity, {
                where: { name: updateDto.name }
            } );

            if ( existing ) {
                throw new BadRequestException( { message: 'Tag with this name already exists' } );
            }
        }

        Object.assign( tag, updateDto );
        const updated = await this.dataSource.manager.save( tag );

        return toApiResponse( 'Tag updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.TAG } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string ) {
        const tag = await this.dataSource.manager.findOne( TagEntity, { where: { id } } );

        if ( !tag ) {
            throw new NotFoundException( { message: 'Tag not found' } );
        }

        await this.dataSource.manager.softDelete( TagEntity, { id } );

        return toMessageResponse( 'Tag deleted successfully' );
    }
}
