import { Controller, Get, Post, Delete, Body, Param, HttpStatus, HttpCode, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionTagEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, serializeEntity } from 'src/utils/response';
import { AuthenticatedUser } from 'src/decorators';
import Type from 'typebox'
import type { Static } from 'typebox';

const CreateSessionTagRequest = Type.Object( {
    name: Type.String( { minLength: 1, maxLength: 50 } ),
    color: Type.Optional( Type.String( { pattern: '^#[0-9A-Fa-f]{6}$' } ) ),
} );

@ApiTags( 'Session Tags' )
@ApiBearerAuth()
@Controller( { path: 'session-tags', version: '1' } )
export class SessionTagsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.STUDY_SESSION } )
    @ApiBody( { schema: CreateSessionTagRequest } )
    @ApiOkResponse()
    async create( @Body() createDto: Static<typeof CreateSessionTagRequest>, @AuthenticatedUser() currentUser: any ) {
        const tag = this.dataSource.manager.create( SessionTagEntity, {
            ...createDto,
            userId: currentUser.id,
        } );
        const saved = await this.dataSource.manager.save( tag );
        return toApiResponse( 'Tag created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    @ApiOkResponse()
    async findAll( @AuthenticatedUser() currentUser: any ) {
        const tags = await this.dataSource.manager.find( SessionTagEntity, {
            where: { userId: currentUser.id },
            order: { name: 'ASC' }
        } );
        return toApiListResponse( tags.map( t => serializeEntity( t ) ), tags.length, 1, tags.length );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'id', type: String } )
    @ApiOkResponse()
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const tag = await this.dataSource.manager.findOne( SessionTagEntity, {
            where: { id, userId: currentUser.id }
        } );
        
        if ( !tag ) {
            throw new NotFoundException( { message: 'Tag not found' } );
        }

        await this.dataSource.manager.remove( tag );
        return toApiResponse( 'Tag deleted successfully', null );
    }
}
