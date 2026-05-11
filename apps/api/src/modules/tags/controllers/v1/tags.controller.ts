import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { 
    TagEntity, 
    MasterProblemTagEntity, 
    UserProblemTagEntity,
    UserModuleTagEntity,
    UserTopicTagEntity,
    StudySessionTagEntity
} from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { CreateTagRequest, UpdateTagRequest } from '../../dtos';
import Type from 'typebox';

@ApiTags( 'Tags' )
@ApiBearerAuth()
@Controller( { path: 'tags', version: '1' } )
export class TagsController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
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
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
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
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
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
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
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
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
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

    @Post( 'master-problem/:problemId' )
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.MASTER_PROBLEM } )
    @ApiParam( { name: 'problemId', type: String } )
    @ApiBody( { schema: Type.Object( { tagIds: Type.Array( Type.String() ) } ) } )
    async attachToMasterProblem(
        @Param( 'problemId' ) problemId: string,
        @Body() body: { tagIds: string[] }
    ) {
        const { tagIds } = body;

        const tags = await this.dataSource.manager.findByIds( TagEntity, tagIds );
        if ( tags.length !== tagIds.length ) {
            throw new NotFoundException( { message: 'One or more tags not found' } );
        }

        const existingLinks = await this.dataSource.manager.find( MasterProblemTagEntity, {
            where: { masterProblemId: problemId }
        } );

        const existingTagIds = new Set( existingLinks.map( link => link.tagId ) );
        const newTagIds = tagIds.filter( id => !existingTagIds.has( id ) );

        for ( const tagId of newTagIds ) {
            const link = this.dataSource.manager.create( MasterProblemTagEntity, {
                masterProblemId: problemId,
                tagId
            } );
            await this.dataSource.manager.save( link );

            await this.dataSource.manager.increment( TagEntity, { id: tagId }, 'usageCount', 1 );
        }

        return toMessageResponse( 'Tags attached to problem successfully' );
    }

    @Delete( 'master-problem/:problemId/:tagId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.MASTER_PROBLEM } )
    @ApiParam( { name: 'problemId', type: String } )
    @ApiParam( { name: 'tagId', type: String } )
    async detachFromMasterProblem(
        @Param( 'problemId' ) problemId: string,
        @Param( 'tagId' ) tagId: string
    ) {
        await this.dataSource.manager.delete( MasterProblemTagEntity, {
            masterProblemId: problemId,
            tagId
        } );

        await this.dataSource.manager.decrement( TagEntity, { id: tagId }, 'usageCount', 1 );

        return toMessageResponse( 'Tag detached from problem successfully' );
    }

    @Post( 'user-problem/:problemId' )
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_PROBLEM } )
    @ApiParam( { name: 'problemId', type: String } )
    @ApiBody( { schema: Type.Object( { tagIds: Type.Array( Type.String() ) } ) } )
    async attachToUserProblem(
        @Param( 'problemId' ) problemId: string,
        @Body() body: { tagIds: string[] }
    ) {
        const { tagIds } = body;

        const tags = await this.dataSource.manager.findByIds( TagEntity, tagIds );
        if ( tags.length !== tagIds.length ) {
            throw new NotFoundException( { message: 'One or more tags not found' } );
        }

        const existingLinks = await this.dataSource.manager.find( UserProblemTagEntity, {
            where: { userProblemId: problemId }
        } );

        const existingTagIds = new Set( existingLinks.map( link => link.tagId ) );
        const newTagIds = tagIds.filter( id => !existingTagIds.has( id ) );

        for ( const tagId of newTagIds ) {
            const link = this.dataSource.manager.create( UserProblemTagEntity, {
                userProblemId: problemId,
                tagId
            } );
            await this.dataSource.manager.save( link );

            await this.dataSource.manager.increment( TagEntity, { id: tagId }, 'usageCount', 1 );
        }

        return toMessageResponse( 'Tags attached to user problem successfully' );
    }

    @Delete( 'user-problem/:problemId/:tagId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_PROBLEM } )
    @ApiParam( { name: 'problemId', type: String } )
    @ApiParam( { name: 'tagId', type: String } )
    async detachFromUserProblem(
        @Param( 'problemId' ) problemId: string,
        @Param( 'tagId' ) tagId: string
    ) {
        await this.dataSource.manager.delete( UserProblemTagEntity, {
            userProblemId: problemId,
            tagId
        } );

        await this.dataSource.manager.decrement( TagEntity, { id: tagId }, 'usageCount', 1 );

        return toMessageResponse( 'Tag detached from user problem successfully' );
    }

    @Get( 'master-problem/:problemId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.MASTER_PROBLEM } )
    @ApiParam( { name: 'problemId', type: String } )
    async getMasterProblemTags( @Param( 'problemId' ) problemId: string ) {
        const links = await this.dataSource.manager.find( MasterProblemTagEntity, {
            where: { masterProblemId: problemId },
            relations: [ 'tag' ]
        } );

        const tags = links.map( link => serializeEntity( link.tag ) );
        return toApiResponse( 'Tags retrieved successfully', tags );
    }

    @Get( 'user-problem/:problemId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_PROBLEM } )
    @ApiParam( { name: 'problemId', type: String } )
    async getUserProblemTags( @Param( 'problemId' ) problemId: string ) {
        const links = await this.dataSource.manager.find( UserProblemTagEntity, {
            where: { userProblemId: problemId },
            relations: [ 'tag' ]
        } );

        const tags = links.map( link => serializeEntity( link.tag ) );
        return toApiResponse( 'Tags retrieved successfully', tags );
    }

    // ===== USER MODULE TAGS =====

    @Post( 'user-module/:moduleId' )
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_MODULE } )
    @ApiParam( { name: 'moduleId', type: String } )
    @ApiBody( { schema: Type.Object( { tagIds: Type.Array( Type.String() ) } ) } )
    async attachToUserModule(
        @Param( 'moduleId' ) moduleId: string,
        @Body() body: { tagIds: string[] }
    ) {
        const { tagIds } = body;

        const tags = await this.dataSource.manager.findByIds( TagEntity, tagIds );
        if ( tags.length !== tagIds.length ) {
            throw new NotFoundException( { message: 'One or more tags not found' } );
        }

        const existingLinks = await this.dataSource.manager.find( UserModuleTagEntity, {
            where: { userModuleId: moduleId }
        } );

        const existingTagIds = new Set( existingLinks.map( link => link.tagId ) );
        const newTagIds = tagIds.filter( id => !existingTagIds.has( id ) );

        for ( const tagId of newTagIds ) {
            const link = this.dataSource.manager.create( UserModuleTagEntity, {
                userModuleId: moduleId,
                tagId
            } );
            await this.dataSource.manager.save( link );
            await this.dataSource.manager.increment( TagEntity, { id: tagId }, 'usageCount', 1 );
        }

        return toMessageResponse( 'Tags attached to module successfully' );
    }

    @Delete( 'user-module/:moduleId/:tagId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_MODULE } )
    @ApiParam( { name: 'moduleId', type: String } )
    @ApiParam( { name: 'tagId', type: String } )
    async detachFromUserModule(
        @Param( 'moduleId' ) moduleId: string,
        @Param( 'tagId' ) tagId: string
    ) {
        await this.dataSource.manager.delete( UserModuleTagEntity, {
            userModuleId: moduleId,
            tagId
        } );

        await this.dataSource.manager.decrement( TagEntity, { id: tagId }, 'usageCount', 1 );

        return toMessageResponse( 'Tag detached from module successfully' );
    }

    @Get( 'user-module/:moduleId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_MODULE } )
    @ApiParam( { name: 'moduleId', type: String } )
    async getUserModuleTags( @Param( 'moduleId' ) moduleId: string ) {
        const links = await this.dataSource.manager.find( UserModuleTagEntity, {
            where: { userModuleId: moduleId },
            relations: [ 'tag' ]
        } );

        const tags = links.map( link => serializeEntity( link.tag ) );
        return toApiResponse( 'Tags retrieved successfully', tags );
    }

    // ===== USER TOPIC TAGS =====

    @Post( 'user-topic/:topicId' )
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_TOPIC } )
    @ApiParam( { name: 'topicId', type: String } )
    @ApiBody( { schema: Type.Object( { tagIds: Type.Array( Type.String() ) } ) } )
    async attachToUserTopic(
        @Param( 'topicId' ) topicId: string,
        @Body() body: { tagIds: string[] }
    ) {
        const { tagIds } = body;

        const tags = await this.dataSource.manager.findByIds( TagEntity, tagIds );
        if ( tags.length !== tagIds.length ) {
            throw new NotFoundException( { message: 'One or more tags not found' } );
        }

        const existingLinks = await this.dataSource.manager.find( UserTopicTagEntity, {
            where: { userTopicId: topicId }
        } );

        const existingTagIds = new Set( existingLinks.map( link => link.tagId ) );
        const newTagIds = tagIds.filter( id => !existingTagIds.has( id ) );

        for ( const tagId of newTagIds ) {
            const link = this.dataSource.manager.create( UserTopicTagEntity, {
                userTopicId: topicId,
                tagId
            } );
            await this.dataSource.manager.save( link );
            await this.dataSource.manager.increment( TagEntity, { id: tagId }, 'usageCount', 1 );
        }

        return toMessageResponse( 'Tags attached to topic successfully' );
    }

    @Delete( 'user-topic/:topicId/:tagId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_TOPIC } )
    @ApiParam( { name: 'topicId', type: String } )
    @ApiParam( { name: 'tagId', type: String } )
    async detachFromUserTopic(
        @Param( 'topicId' ) topicId: string,
        @Param( 'tagId' ) tagId: string
    ) {
        await this.dataSource.manager.delete( UserTopicTagEntity, {
            userTopicId: topicId,
            tagId
        } );

        await this.dataSource.manager.decrement( TagEntity, { id: tagId }, 'usageCount', 1 );

        return toMessageResponse( 'Tag detached from topic successfully' );
    }

    @Get( 'user-topic/:topicId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_TOPIC } )
    @ApiParam( { name: 'topicId', type: String } )
    async getUserTopicTags( @Param( 'topicId' ) topicId: string ) {
        const links = await this.dataSource.manager.find( UserTopicTagEntity, {
            where: { userTopicId: topicId },
            relations: [ 'tag' ]
        } );

        const tags = links.map( link => serializeEntity( link.tag ) );
        return toApiResponse( 'Tags retrieved successfully', tags );
    }

    // ===== STUDY SESSION TAGS =====

    @Post( 'study-session/:sessionId' )
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'sessionId', type: String } )
    @ApiBody( { schema: Type.Object( { tagIds: Type.Array( Type.String() ) } ) } )
    async attachToStudySession(
        @Param( 'sessionId' ) sessionId: string,
        @Body() body: { tagIds: string[] }
    ) {
        const { tagIds } = body;

        const tags = await this.dataSource.manager.findByIds( TagEntity, tagIds );
        if ( tags.length !== tagIds.length ) {
            throw new NotFoundException( { message: 'One or more tags not found' } );
        }

        const existingLinks = await this.dataSource.manager.find( StudySessionTagEntity, {
            where: { studySessionId: sessionId }
        } );

        const existingTagIds = new Set( existingLinks.map( link => link.tagId ) );
        const newTagIds = tagIds.filter( id => !existingTagIds.has( id ) );

        for ( const tagId of newTagIds ) {
            const link = this.dataSource.manager.create( StudySessionTagEntity, {
                studySessionId: sessionId,
                tagId
            } );
            await this.dataSource.manager.save( link );
            await this.dataSource.manager.increment( TagEntity, { id: tagId }, 'usageCount', 1 );
        }

        return toMessageResponse( 'Tags attached to study session successfully' );
    }

    @Delete( 'study-session/:sessionId/:tagId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'sessionId', type: String } )
    @ApiParam( { name: 'tagId', type: String } )
    async detachFromStudySession(
        @Param( 'sessionId' ) sessionId: string,
        @Param( 'tagId' ) tagId: string
    ) {
        await this.dataSource.manager.delete( StudySessionTagEntity, {
            studySessionId: sessionId,
            tagId
        } );

        await this.dataSource.manager.decrement( TagEntity, { id: tagId }, 'usageCount', 1 );

        return toMessageResponse( 'Tag detached from study session successfully' );
    }

    @Get( 'study-session/:sessionId' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AuthGuard( 'jwt' ), AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'sessionId', type: String } )
    async getStudySessionTags( @Param( 'sessionId' ) sessionId: string ) {
        const links = await this.dataSource.manager.find( StudySessionTagEntity, {
            where: { studySessionId: sessionId },
            relations: [ 'tag' ]
        } );

        const tags = links.map( link => serializeEntity( link.tag ) );
        return toApiResponse( 'Tags retrieved successfully', tags );
    }
}
