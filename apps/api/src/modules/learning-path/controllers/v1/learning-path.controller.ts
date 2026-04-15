import { Controller, Post, Get, Put, Patch, Delete, Body, Param, Query, HttpStatus, HttpCode, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LearningPathEntity } from '@growthos/nestjs-database/entities';
import { LearningPathStatus } from '@growthos/nestjs-shared';
import { AuthenticatedUser } from 'src/decorators';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { 
    CreateLearningPathRequest, 
    UpdateLearningPathRequest,
    LearningPathSchema,
    LearningPathListItemSchema
} from '../../dtos';

@ApiTags( 'Learning Paths' )
@ApiBearerAuth()
@Controller( { path: 'learning-paths', version: '1' } )
export class LearningPathController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.LEARNING_PATH } )
    async create( 
        @Body() createDto: Static<typeof CreateLearningPathRequest>,
        @AuthenticatedUser() currentUser: any
    ) {
        const learningPath = this.dataSource.manager.create( LearningPathEntity, {
            ...createDto,
            createdBy: currentUser.id,
            content: createDto.content || [],
            tags: createDto.tags || [],
            estimatedHours: createDto.estimatedHours || 0,
            status: ( createDto.status as LearningPathStatus ) || LearningPathStatus.DRAFT,
        } );

        const saved = await this.dataSource.manager.save( learningPath );

        return toApiResponse( 
            'Learning path created successfully', 
            serializeEntity( saved ) 
        );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.LEARNING_PATH } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'status', required: false, type: String } )
    async findAll(
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '10',
        @Query( 'status' ) status?: string,
        @AuthenticatedUser() currentUser?: any
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        const whereConditions: any = {};
        
        // Regular users can only see PUBLIC learning paths
        // Admins and content creators can see all
        if ( currentUser?.role === 'USER' ) {
            whereConditions.status = LearningPathStatus.PUBLIC;
        } else if ( status ) {
            whereConditions.status = status;
        }

        const [ learningPaths, total ] = await this.dataSource.manager.findAndCount( 
            LearningPathEntity, 
            {
                where: whereConditions,
                skip,
                take: limitNum,
                order: { createdAt: 'DESC' },
            }
        );

        return toApiListResponse(
            learningPaths.map( lp => serializeEntity( lp, [
                'id', 'title', 'description', 'status', 'thumbnail', 
                'estimatedHours', 'tags', 'createdBy', 'createdAt', 'updatedAt'
            ] ) ),
            total,
            pageNum,
            limitNum
        );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    async findOne(
        @Param( 'id' ) id: string,
        @AuthenticatedUser() currentUser?: any
    ) {
        const learningPath = await this.dataSource.manager.findOne( 
            LearningPathEntity, 
            { where: { id } }
        );

        if ( !learningPath ) {
            throw new NotFoundException( { message: 'Learning path not found' } );
        }

        // Regular users can only view PUBLIC learning paths
        if ( currentUser?.role === 'USER' && learningPath.status !== LearningPathStatus.PUBLIC ) {
            throw new NotFoundException( { message: 'Learning path not found' } );
        }

        return serializeEntity( learningPath );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateLearningPathRequest>,
    ) {
        const learningPath = await this.dataSource.manager.findOne( 
            LearningPathEntity, 
            { where: { id } }
        );

        if ( !learningPath ) {
            throw new NotFoundException( { message: 'Learning path not found' } );
        }

        Object.assign( learningPath, updateDto );
        const updated = await this.dataSource.manager.save( learningPath );

        return toApiResponse( 
            'Learning path updated successfully', 
            serializeEntity( updated ) 
        );
    }

    @Patch( ':id/deactivate' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.LEARNING_PATH } )
    @ApiParam( { name: 'id', type: String } )
    async deactivate( @Param( 'id' ) id: string ) {
        const learningPath = await this.dataSource.manager.findOne( 
            LearningPathEntity, 
            { where: { id } }
        );

        if ( !learningPath ) {
            throw new NotFoundException( { message: 'Learning path not found' } );
        }

        learningPath.status = LearningPathStatus.INACTIVE;
        await this.dataSource.manager.save( learningPath );

        return toMessageResponse( 'Learning path deactivated successfully' );
    }
}
