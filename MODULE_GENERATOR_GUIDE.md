# GrowthOS API Module Generator Guide

## ✅ Completed Modules (6 total)

1. **Learning Paths** - `/v1/learning-paths`
2. **Tags** - `/v1/tags`
3. **Master Problems** - `/v1/master-problems`
4. **Master Topics** - `/v1/master-topics`
5. **Master Learning Paths** - `/v1/master-learning-paths`
6. **Auth** (existing) - `/v1/auth`

## 📋 Remaining Modules (9 total)

### User Progress Tracking
- `user-learning-paths` - User's enrolled learning paths
- `user-topics` - User's topic progress
- `user-problems` - User's problem attempts/status

### Activity Tracking
- `problem-attempts` - Detailed attempt records
- `study-sessions` - Time tracking & analytics
- `streaks` - Daily/weekly streak tracking
- `goals` - User goals & targets

### Content
- `notes` - User notes on problems/topics
- `resources` - Learning resources/links

## 🚀 Quick Module Generator Template

For each remaining module, follow this pattern:

### 1. Create DTOs (`dtos/<module>.dto.ts`)

```typescript
import Type from 'typebox';

export const Create<ModuleName>Request = Type.Object({
    // Add fields from entity
    field1: Type.String(),
    field2: Type.Optional(Type.Number()),
});

export const Update<ModuleName>Request = Type.Object({
    // Same fields but all optional
    field1: Type.Optional(Type.String()),
    field2: Type.Optional(Type.Number()),
});
```

### 2. Create Controller (`controllers/v1/<module>.controller.ts`)

```typescript
import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Static } from 'typebox';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { <Entity>Entity } from '@growthos/nestjs-database/entities';
import { CheckAbilities, AbilitiesGuard, Action, Subject } from '@growthos/nestjs-casl';
import { toApiResponse, toApiListResponse, toMessageResponse, serializeEntity } from 'src/utils/response';
import { Create<Module>Request, Update<Module>Request } from '../../dtos';
import { AuthenticatedUser } from 'src/decorators';

@ApiTags('<Module Name>')
@ApiBearerAuth()
@Controller({ path: '<module-path>', version: '1' })
export class <Module>Controller {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.CREATE, subject: Subject.<SUBJECT> })
    async create(
        @Body() createDto: Static<typeof Create<Module>Request>,
        @AuthenticatedUser() currentUser: any
    ) {
        // For user-specific modules, add userId filter
        const entity = this.dataSource.manager.create(<Entity>Entity, {
            ...createDto,
            userId: currentUser.id, // Add for user-specific modules
        });

        const saved = await this.dataSource.manager.save(entity);
        return toApiResponse('Created successfully', serializeEntity(saved));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.READ, subject: Subject.<SUBJECT> })
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @AuthenticatedUser() currentUser: any
    ) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const whereConditions: any = {};
        
        // For user-specific modules, filter by userId
        if (currentUser?.role === 'USER') {
            whereConditions.userId = currentUser.id;
        }

        const [items, total] = await this.dataSource.manager.findAndCount(<Entity>Entity, {
            where: whereConditions,
            skip,
            take: limitNum,
            order: { createdAt: 'DESC' },
        });

        return toApiListResponse(
            items.map(item => serializeEntity(item)),
            total,
            pageNum,
            limitNum
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.READ, subject: Subject.<SUBJECT> })
    async findOne(
        @Param('id') id: string,
        @AuthenticatedUser() currentUser: any
    ) {
        const whereConditions: any = { id };
        
        // For user-specific modules
        if (currentUser?.role === 'USER') {
            whereConditions.userId = currentUser.id;
        }

        const item = await this.dataSource.manager.findOne(<Entity>Entity, { where: whereConditions });

        if (!item) {
            throw new NotFoundException({ message: 'Not found' });
        }

        return serializeEntity(item);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.UPDATE, subject: Subject.<SUBJECT> })
    async update(
        @Param('id') id: string,
        @Body() updateDto: Static<typeof Update<Module>Request>,
        @AuthenticatedUser() currentUser: any
    ) {
        const whereConditions: any = { id };
        
        if (currentUser?.role === 'USER') {
            whereConditions.userId = currentUser.id;
        }

        const item = await this.dataSource.manager.findOne(<Entity>Entity, { where: whereConditions });

        if (!item) {
            throw new NotFoundException({ message: 'Not found' });
        }

        Object.assign(item, updateDto);
        const updated = await this.dataSource.manager.save(item);

        return toApiResponse('Updated successfully', serializeEntity(updated));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.DELETE, subject: Subject.<SUBJECT> })
    async delete(
        @Param('id') id: string,
        @AuthenticatedUser() currentUser: any
    ) {
        const whereConditions: any = { id };
        
        if (currentUser?.role === 'USER') {
            whereConditions.userId = currentUser.id;
        }

        const item = await this.dataSource.manager.findOne(<Entity>Entity, { where: whereConditions });

        if (!item) {
            throw new NotFoundException({ message: 'Not found' });
        }

        await this.dataSource.manager.softDelete(<Entity>Entity, { id });
        return toMessageResponse('Deleted successfully');
    }
}
```

### 3. Create Module (`<module>.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { <Module>Controller } from './controllers/v1/<module>.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <Entity>Entity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module({
    imports: [
        TypeOrmModule.forFeature([<Entity>Entity]),
        CaslModule.forRoot(),
    ],
    controllers: [<Module>Controller],
})
export class <Module>Module {}
```

### 4. Register Module

**app.module.ts:**
```typescript
import { <Module>Module } from './modules/<module>';

// Add to imports array:
<Module>Module,
```

**modules/index.ts:**
```typescript
export * from './<module>';
```

## 📊 Field Reference by Entity

### UserLearningPathEntity
- name (string, required)
- description (string, optional)
- targetDate (date, optional)
- targetProblems (number, optional)
- masterLearningPathId (string, optional)
- userId (auto-filled)

### UserTopicEntity
- userLearningPathId (string, required)
- name (string, required)
- description (string, optional)
- status (enum: NOT_STARTED, IN_PROGRESS, COMPLETED, MASTERED)
- orderIndex (number)
- confidenceScore (number, 0-100)
- masterTopicId (string, optional)

### UserProblemEntity
- userTopicId (string, required)
- title (string, required)
- externalUrl (string, optional)
- difficulty (enum: EASY, MEDIUM, HARD)
- status (enum: TODO, IN_PROGRESS, SOLVED, REVIEWING)
- source (enum: LEETCODE, HACKERRANK, CODECHEF, CODEFORCES, CUSTOM)
- approachNotes (string, optional)
- solution (string, optional)
- isStarred (boolean)
- masterProblemId (string, optional)

## 🔥 Pro Tips

1. **Use the response helpers** - Always use `toApiResponse()`, `toApiListResponse()`, `toMessageResponse()`
2. **Auto serialize dates** - `serializeEntity()` handles date conversion automatically
3. **User-specific security** - Always filter by `userId` for user-owned resources
4. **Pagination** - All list endpoints should support `page` and `limit` query params
5. **CASL guards** - Use `@UseGuards(AbilitiesGuard)` and `@CheckAbilities()` on all endpoints

## 🚀 Next Steps

1. Copy the template above
2. Replace placeholders: `<Module>`, `<Entity>`, `<SUBJECT>`, `<module-path>`
3. Add entity-specific fields to DTOs
4. Build and test
5. Repeat for each remaining module

