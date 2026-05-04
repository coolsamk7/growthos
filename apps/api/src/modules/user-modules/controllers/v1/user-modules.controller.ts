import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModuleEntity, UserLearningPathEntity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { 
    CreateUserModuleRequest, 
    UpdateUserModuleRequest,
    CreateUserModuleResponse,
    UpdateUserModuleResponse,
    GetUserModuleResponse,
    GetUserModulesResponse,
    DeleteUserModuleResponse,
} from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags( 'User Modules' )
@ApiBearerAuth()
@Controller( { path: 'user-modules', version: '1' } )
export class UserModulesController {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode( HttpStatus.CREATED )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.CREATE, subject: Subject.USER_MODULE } )
    @ApiBody( { schema: CreateUserModuleRequest } )
    @ApiCreatedResponse( { schema: CreateUserModuleResponse } )
    async create(
        @Body() createDto: Static<typeof CreateUserModuleRequest>,
        @AuthenticatedUser() currentUser: any
    ) {
        // Verify the user owns the learning path
        const learningPath = await this.dataSource.manager.findOne( UserLearningPathEntity, {
            where: { id: createDto.userLearningPathId, userId: currentUser.id },
        } );

        if ( !learningPath ) {
            throw new NotFoundException( { message: 'User learning path not found' } );
        }

        // If orderIndex not provided, set it to the next available position
        let orderIndex = createDto.orderIndex;
        if ( orderIndex === undefined ) {
            const maxOrder = await this.dataSource.manager
                .createQueryBuilder( UserModuleEntity, 'module' )
                .where( 'module.userLearningPathId = :pathId', { pathId: createDto.userLearningPathId } )
                .select( 'MAX(module.orderIndex)', 'max' )
                .getRawOne();
            orderIndex = ( maxOrder?.max ?? -1 ) + 1;
        }

        const module = this.dataSource.manager.create( UserModuleEntity, {
            ...createDto,
            orderIndex,
        } );

        const saved = await this.dataSource.manager.save( module );
        return toApiResponse( 'User module created successfully', serializeEntity( saved ) );
    }

    @Get()
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_MODULE } )
    @ApiQuery( { name: 'page', required: false, type: Number } )
    @ApiQuery( { name: 'limit', required: false, type: Number } )
    @ApiQuery( { name: 'userLearningPathId', required: false, type: String } )
    @ApiOkResponse( { schema: GetUserModulesResponse } )
    async findAll(
        @AuthenticatedUser() currentUser: any,
        @Query( 'page' ) page: string = '1',
        @Query( 'limit' ) limit: string = '20',
        @Query( 'userLearningPathId' ) userLearningPathId?: string
    ) {
        const pageNum = parseInt( page, 10 );
        const limitNum = parseInt( limit, 10 );
        const skip = ( pageNum - 1 ) * limitNum;

        // Build query to verify user ownership via learning path
        const queryBuilder = this.dataSource.manager
            .createQueryBuilder( UserModuleEntity, 'module' )
            .leftJoin( 'module.userLearningPath', 'path' )
            .where( 'path.userId = :userId', { userId: currentUser.id } );

        if ( userLearningPathId ) {
            queryBuilder.andWhere( 'module.userLearningPathId = :pathId', { pathId: userLearningPathId } );
        }

        const [ modules, total ] = await queryBuilder
            .orderBy( 'module.orderIndex', 'ASC' )
            .skip( skip )
            .take( limitNum )
            .getManyAndCount();

        return toApiListResponse(
            modules.map( m => serializeEntity( m ) ),
            total,
            pageNum,
            limitNum
        );
    }

    @Get( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.READ, subject: Subject.USER_MODULE } )
    @ApiParam( { name: 'id', type: String } )
    @ApiOkResponse( { schema: GetUserModuleResponse } )
    async findOne( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const module = await this.dataSource.manager
            .createQueryBuilder( UserModuleEntity, 'module' )
            .leftJoin( 'module.userLearningPath', 'path' )
            .where( 'module.id = :id', { id } )
            .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
            .getOne();

        if ( !module ) {
            throw new NotFoundException( { message: 'User module not found' } );
        }

        return serializeEntity( module );
    }

    @Put( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.UPDATE, subject: Subject.USER_MODULE } )
    @ApiParam( { name: 'id', type: String } )
    @ApiBody( { schema: UpdateUserModuleRequest } )
    @ApiOkResponse( { schema: UpdateUserModuleResponse } )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateDto: Static<typeof UpdateUserModuleRequest>,
        @AuthenticatedUser() currentUser: any
    ) {
        const module = await this.dataSource.manager
            .createQueryBuilder( UserModuleEntity, 'module' )
            .leftJoin( 'module.userLearningPath', 'path' )
            .where( 'module.id = :id', { id } )
            .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
            .getOne();

        if ( !module ) {
            throw new NotFoundException( { message: 'User module not found' } );
        }

        Object.assign( module, {
            ...updateDto,
            startedAt: updateDto.startedAt ? new Date( updateDto.startedAt ) : module.startedAt,
            completedAt: updateDto.completedAt ? new Date( updateDto.completedAt ) : module.completedAt,
        } );

        const updated = await this.dataSource.manager.save( module );
        return toApiResponse( 'User module updated successfully', serializeEntity( updated ) );
    }

    @Delete( ':id' )
    @HttpCode( HttpStatus.OK )
    @UseGuards( AbilitiesGuard )
    @CheckAbilities( { action: Action.DELETE, subject: Subject.USER_MODULE } )
    @ApiParam( { name: 'id', type: String } )
    @ApiOkResponse( { schema: DeleteUserModuleResponse } )
    async delete( @Param( 'id' ) id: string, @AuthenticatedUser() currentUser: any ) {
        const module = await this.dataSource.manager
            .createQueryBuilder( UserModuleEntity, 'module' )
            .leftJoin( 'module.userLearningPath', 'path' )
            .where( 'module.id = :id', { id } )
            .andWhere( 'path.userId = :userId', { userId: currentUser.id } )
            .getOne();

        if ( !module ) {
            throw new NotFoundException( { message: 'User module not found' } );
        }

        await this.dataSource.manager.softDelete( UserModuleEntity, { id } );
        return toMessageResponse( 'User module deleted successfully' );
    }
}
