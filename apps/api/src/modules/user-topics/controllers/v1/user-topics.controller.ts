import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { UserTopicEntity, UserLearningPathEntity, UserModuleEntity, UserProblemEntity } from '@growthos/nestjs-database/entities';
import { TopicStatus } from '@growthos/nestjs-shared';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateUserTopicRequest, UpdateUserTopicRequest } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'User Topics' )
@ApiBearerAuth()
@Controller( { path: 'user-topics', version: '1' } )
export class UserTopicsController {
    constructor( @InjectDataSource() private readonly dataSource: DataSource ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.USER_TOPIC } )
    @ApiBody( { schema: CreateUserTopicRequest } )
    async create( @Body() createDto: Static<typeof CreateUserTopicRequest>, @AuthenticatedUser() currentUser: any ) {
        // Verify user owns the learning path
        const learningPath = await this.dataSource.manager.findOne( UserLearningPathEntity, {
            where: { id: createDto.userLearningPathId, userId: currentUser.id },
        } );

        if ( !learningPath ) {
            throw new NotFoundException( { message: 'User learning path not found' } );
        }

        // If userModuleId is provided, verify user owns the module
        if ( createDto.userModuleId ) {
            const module = await this.dataSource.manager
                .createQueryBuilder( UserModuleEntity, 'module' )
                .leftJoin( 'module.userLearningPath', 'path' )
                .where( 'module.id = :moduleId', { moduleId: createDto.userModuleId } )
                .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
                .getOne();

            if ( !module ) {
                throw new NotFoundException( { message: 'User module not found' } );
            }
        }

        const item = this.dataSource.manager.create( UserTopicEntity, { 
            ...createDto,
            status: ( createDto.status as TopicStatus ) || TopicStatus.NOT_STARTED,
        } );
        const saved = await this.dataSource.manager.save( item );
        return toApiResponse( 'Created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_TOPIC } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'userModuleId', required: true, type: String } )
    async findAll( 
        @AuthenticatedUser() currentUser: any,
        @Query( 'page' ) page: string = '1', 
        @Query( 'limit' ) limit: string = '20',
        @Query( 'userModuleId' ) userModuleId: string
    ) {

        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;
        
        console.log( '[UserTopics] Request received - userModuleId:', userModuleId, 'userId:', currentUser.id );
        
        if ( !userModuleId || userModuleId === 'undefined' || userModuleId === 'null' ) {
            console.log( '[UserTopics] ERROR: Invalid userModuleId received' );
            throw new NotFoundException( { message: 'userModuleId is required' } );
        }
        
        const [ items, total ] = await this.dataSource.manager.findAndCount( UserTopicEntity, { 
            where: { userModuleId }, 
            skip, 
            take: limitNum, 
            order: { orderIndex: 'ASC', createdAt: 'DESC' } 
        } );
        
        console.log( '[UserTopics] Query result - Found:', items.length, 'topics for module:', userModuleId );
        
        // Add problem counts to each topic
        const topicsWithCounts = await Promise.all(
            items.map( async ( topic ) => {
                const problemCount = await this.dataSource.manager.count( UserProblemEntity, {
                    where: { userTopicId: topic.id }
                } );
                return {
                    ...serializeEntity( topic ),
                    problemCount
                };
            } )
        );
        
        return toApiListResponse( topicsWithCounts, total, pageNum, limitNum );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_TOPIC } )
    @ApiParam( { name: 'id', type: String } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const item = await this.dataSource.manager
            .createQueryBuilder( UserTopicEntity, 'topic' )
            .leftJoin( 'topic.userLearningPath', 'path' )
            .where( 'topic.id = :id', { id } )
            .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
            .getOne();
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        return serializeEntity( item );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_TOPIC } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateUserTopicRequest } )
    async update( @Param( 'id' ) id: string, @Body() updateDto: Static<typeof UpdateUserTopicRequest>, @AuthenticatedUser() currentUser: any ) {
        const item = await this.dataSource.manager
            .createQueryBuilder( UserTopicEntity, 'topic' )
            .leftJoin( 'topic.userLearningPath', 'path' )
            .where( 'topic.id = :id', { id } )
            .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
            .getOne();
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        Object.assign( item, updateDto );
        const updated = await this.dataSource.manager.save( item );
        return toApiResponse( 'Updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.USER_TOPIC } )
    @ApiParam( { name: 'id', type: String } )
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const item = await this.dataSource.manager
            .createQueryBuilder( UserTopicEntity, 'topic' )
            .leftJoin( 'topic.userLearningPath', 'path' )
            .where( 'topic.id = :id', { id } )
            .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
            .getOne();
        if ( !item ) throw new NotFoundException( { message: 'Not found' } );
        await this.dataSource.manager.softDelete( UserTopicEntity, { id } );
        return toMessageResponse( 'Deleted successfully' );
    }
}
