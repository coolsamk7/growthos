import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserLearningPathEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { 
    CreateUserLearningPathRequest, 
    UpdateUserLearningPathRequest,
    CreateUserLearningPathResponse,
    UpdateUserLearningPathResponse,
    GetUserLearningPathResponse,
    GetUserLearningPathsResponse,
    DeleteUserLearningPathResponse,
} from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'User Learning Paths' )
@ApiBearerAuth()
@Controller( { path: 'user-learning-paths', version: '1' } )
export class UserLearningPathsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.USER_LEARNING_PATH } )
    @ApiBody( { schema: CreateUserLearningPathRequest } )
    @ApiCreatedResponse( { schema: CreateUserLearningPathResponse } )
    async create(
        @Body() createDto: Static<typeof CreateUserLearningPathRequest>,
        @AuthenticatedUser() currentUser: any
    ) {
        const path = this.dataSource.manager.create( UserLearningPathEntity, {
            ...createDto,
            userId: currentUser.id,
            targetDate: createDto.targetDate ? new Date( createDto.targetDate ) : undefined,
        } );

        const saved = await this.dataSource.manager.save( path );
        return toApiResponse( 'User learning path created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_LEARNING_PATH } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiOkResponse( { schema: GetUserLearningPathsResponse } )
    async findAll(
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @AuthenticatedUser() currentUser: any
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        const whereConditions: any = {};
        if ( currentUser?.role === 'USER' ) {
            whereConditions.userId = currentUser.id;
        }

        const [ paths, total ] = await this.dataSource.manager.findAndCount( UserLearningPathEntity, {
            where: whereConditions,
            skip,
            take: limitNum,
            order: { createdAt: 'DESC' },
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
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    @ApiOkResponse( { schema: GetUserLearningPathResponse } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const whereConditions: any = { id };
        if ( currentUser?.role === 'USER' ) {
            whereConditions.userId = currentUser.id;
        }

        const path = await this.dataSource.manager.findOne( UserLearningPathEntity, { where: whereConditions } );

        if ( !path ) {
            throw new NotFoundException( { message: 'User learning path not found' } );
        }

        return serializeEntity( path );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateUserLearningPathRequest } )
    @ApiOkResponse( { schema: UpdateUserLearningPathResponse } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateUserLearningPathRequest>,
        @AuthenticatedUser() currentUser: any
    ) {
        const whereConditions: any = { id };
        if ( currentUser?.role === 'USER' ) {
            whereConditions.userId = currentUser.id;
        }

        const path = await this.dataSource.manager.findOne( UserLearningPathEntity, { where: whereConditions } );

        if ( !path ) {
            throw new NotFoundException( { message: 'User learning path not found' } );
        }

        Object.assign( path, {
            ...updateDto,
            targetDate: updateDto.targetDate ? new Date( updateDto.targetDate ) : path.targetDate,
        } );

        const updated = await this.dataSource.manager.save( path );
        return toApiResponse( 'User learning path updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.USER_LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    @ApiOkResponse( { schema: DeleteUserLearningPathResponse } )
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const whereConditions: any = { id };
        if ( currentUser?.role === 'USER' ) {
            whereConditions.userId = currentUser.id;
        }

        const path = await this.dataSource.manager.findOne( UserLearningPathEntity, { where: whereConditions } );

        if ( !path ) {
            throw new NotFoundException( { message: 'User learning path not found' } );
        }

        await this.dataSource.manager.softDelete( UserLearningPathEntity, { id } );
        return toMessageResponse( 'User learning path deleted successfully' );
    }
}
