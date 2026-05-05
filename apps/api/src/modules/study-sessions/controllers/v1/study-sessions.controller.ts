import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Between } from 'typeorm';
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
        const sessionDate = createDto.sessionDate || new Date().toISOString().split( 'T' )[0];
        const item = this.dataSource.manager.create( StudySessionEntity, { 
            ...createDto, 
            userId: currentUser.id,
            sessionDate: new Date( sessionDate ),
            durationMinutes: createDto.durationMinutes || 0,
        } );
        const saved = await this.dataSource.manager.save( item );
        return toApiResponse( 'Created successfully', serializeEntity( saved ) );
    }

    @Post( 'start' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.STUDY_SESSION } )
    @ApiBody( { schema: CreateStudySessionRequest } )
    async startSession( @Body() createDto: Static<typeof CreateStudySessionRequest>, @AuthenticatedUser() currentUser: any ) {
        // Check for active session
        const activeSession = await this.dataSource.manager.findOne( StudySessionEntity, {
            where: { userId: currentUser.id, isActive: true }
        } );
        
        if ( activeSession ) {
            throw new BadRequestException( { message: 'You already have an active session. Please stop it first.' } );
        }

        const now = new Date();
        const sessionDate = now.toISOString().split( 'T' )[0];
        const item = this.dataSource.manager.create( StudySessionEntity, {
            ...createDto,
            userId: currentUser.id,
            startTime: now,
            sessionDate: new Date( sessionDate ),
            isActive: true,
            durationMinutes: 0,
        } );
        const saved = await this.dataSource.manager.save( item );
        return toApiResponse( 'Session started successfully', serializeEntity( saved ) );
    }

    @Put( ':id/stop' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.STUDY_SESSION } )
    @ApiParam( { name: 'id', type: String } )
    async stopSession( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const where: any = { id, userId: currentUser.id, isActive: true };
        const item = await this.dataSource.manager.findOne( StudySessionEntity, { where } );
        
        if ( !item ) throw new NotFoundException( { message: 'Active session not found' } );

        const now = new Date();
        item.endTime = now;
        item.isActive = false;
        
        if ( item.startTime ) {
            const durationMs = now.getTime() - item.startTime.getTime();
            const totalSeconds = Math.floor( durationMs / 1000 );
            item.durationSeconds = totalSeconds;
            item.durationMinutes = Math.floor( totalSeconds / 60 );
        }

        const updated = await this.dataSource.manager.save( item );
        return toApiResponse( 'Session stopped successfully', serializeEntity( updated ) );
    }

    @Get( 'active' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    async getActiveSession( @AuthenticatedUser() currentUser: any ) {
        const item = await this.dataSource.manager.findOne( StudySessionEntity, {
            where: { userId: currentUser.id, isActive: true },
            relations: [ 'userLearningPath', 'userModule', 'userTopic', 'userProblem' ]
        } );
        
        if ( !item ) {
            return toApiResponse( 'No active session', null );
        }
        
        return toApiResponse( 'Active session found', serializeEntity( item ) );
    }

    @Get( 'heatmap' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    @ApiQuery( { name: 'startDate', required: false, type: String } )
    @ApiQuery( { name: 'endDate', required: false, type: String } )
    async getHeatmap( 
        @Query( 'startDate' ) startDate?: string, 
        @Query( 'endDate' ) endDate?: string,
        @AuthenticatedUser() currentUser?: any 
    ) {
        const endDate_obj = endDate ? new Date( endDate ) : new Date();
        const startDate_obj = startDate ? new Date( startDate ) : new Date( endDate_obj.getTime() - 365 * 24 * 60 * 60 * 1000 );
        
        // Set to start of day for start and end of day for end to include the full range
        startDate_obj.setHours( 0, 0, 0, 0 );
        endDate_obj.setHours( 23, 59, 59, 999 );

        const sessions = await this.dataSource.manager.find( StudySessionEntity, {
            where: {
                userId: currentUser.id,
                sessionDate: Between( startDate_obj, endDate_obj ),
                isActive: false  // Only include completed sessions
            },
            select: [ 'id', 'sessionDate', 'durationMinutes', 'durationSeconds' ]
        } );

        console.log( 'Heatmap query:', { 
            userId: currentUser.id,
            startDate: startDate_obj.toISOString(),
            endDate: endDate_obj.toISOString(),
            sessionsFound: sessions.length 
        } );

        const heatmapData: Record<string, number> = {};
        sessions.forEach( session => {
            // Convert sessionDate to string format YYYY-MM-DD
            const date = session.sessionDate as any;
            let dateKey: string;
            
            if ( date instanceof Date ) {
                dateKey = date.toISOString().split( 'T' )[0];
            } else if ( typeof date === 'string' ) {
                dateKey = date.split( 'T' )[0];
            } else {
                dateKey = String( date ).split( 'T' )[0];
            }
            
            // Calculate total minutes from both durationMinutes and durationSeconds
            // Prefer durationSeconds if it exists and is greater than 0, otherwise use durationMinutes
            let totalMinutes = 0;
            if ( session.durationSeconds && session.durationSeconds > 0 ) {
                // Round up to at least 1 minute if there's any study time
                totalMinutes = Math.max( 1, Math.floor( session.durationSeconds / 60 ) );
            } else if ( session.durationMinutes && session.durationMinutes > 0 ) {
                totalMinutes = session.durationMinutes;
            }
            
            console.log( 'Processing session:', { 
                id: session.id,
                dateKey, 
                durationMinutes: session.durationMinutes,
                durationSeconds: session.durationSeconds,
                totalMinutes 
            } );
            
            heatmapData[dateKey] = ( heatmapData[dateKey] || 0 ) + totalMinutes;
        } );

        console.log( 'Final heatmap data:', heatmapData );

        return toApiResponse( 'Heatmap data retrieved', heatmapData );
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
        const [ items, total ] = await this.dataSource.manager.findAndCount( StudySessionEntity, { 
            where, 
            skip, 
            take: limitNum, 
            order: { createdAt: 'DESC' },
            relations: [ 'userLearningPath', 'userModule', 'userTopic', 'userProblem' ]
        } );
        return toApiListResponse( items.map( i => serializeEntity( i ) ), total, pageNum, limitNum );
    }

    @Get( 'search' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.STUDY_SESSION } )
    @ApiQuery( { name: 'q', required: false, type: String } )
    @ApiQuery( { name: 'startDate', required: false, type: String } )
    @ApiQuery( { name: 'endDate', required: false, type: String } )
    @ApiQuery( { name: 'moduleId', required: false, type: String } )
    @ApiQuery( { name: 'topicId', required: false, type: String } )
    @ApiQuery( { name: 'problemId', required: false, type: String } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    async search( 
        @Query( 'q' ) query?: string,
        @Query( 'startDate' ) startDate?: string,
        @Query( 'endDate' ) endDate?: string,
        @Query( 'moduleId' ) moduleId?: string,
        @Query( 'topicId' ) topicId?: string,
        @Query( 'problemId' ) problemId?: string,
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @AuthenticatedUser() currentUser?: any 
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;
        
        const queryBuilder = this.dataSource.manager
            .createQueryBuilder( StudySessionEntity, 'session' )
            .leftJoinAndSelect( 'session.userModule', 'module' )
            .leftJoinAndSelect( 'session.userTopic', 'topic' )
            .leftJoinAndSelect( 'session.userProblem', 'problem' )
            .where( 'session.userId = :userId', { userId: currentUser.id } );
        
        // Text search in notes
        if ( query ) {
            queryBuilder.andWhere( 'session.notes ILIKE :query', { query: `%${query}%` } );
        }
        
        // Date range filter
        if ( startDate ) {
            queryBuilder.andWhere( 'session.sessionDate >= :startDate', { startDate: new Date( startDate ) } );
        }
        if ( endDate ) {
            queryBuilder.andWhere( 'session.sessionDate <= :endDate', { endDate: new Date( endDate ) } );
        }
        
        // Content filters
        if ( moduleId ) {
            queryBuilder.andWhere( 'session.userModuleId = :moduleId', { moduleId } );
        }
        if ( topicId ) {
            queryBuilder.andWhere( 'session.userTopicId = :topicId', { topicId } );
        }
        if ( problemId ) {
            queryBuilder.andWhere( 'session.userProblemId = :problemId', { problemId } );
        }
        
        // Get total count
        const total = await queryBuilder.getCount();
        
        // Get paginated results
        const items = await queryBuilder
            .orderBy( 'session.createdAt', 'DESC' )
            .skip( skip )
            .take( limitNum )
            .getMany();
        
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
        const item = await this.dataSource.manager.findOne( StudySessionEntity, { 
            where,
            relations: [ 'userLearningPath', 'userModule', 'userTopic', 'userProblem' ]
        } );
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
