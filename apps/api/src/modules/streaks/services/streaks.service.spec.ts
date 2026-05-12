import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { StreaksService } from './streaks.service';
import { StreakEntity } from '@growthos/nestjs-database/entities';

describe( 'StreaksService', () => {
    let service: StreaksService;
    let dataSource: DataSource;

    const mockDataSource = {
        manager: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        },
    };

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule( {
            providers: [
                StreaksService,
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        } ).compile();

        service = module.get<StreaksService>( StreaksService );
        dataSource = module.get<DataSource>( DataSource );
    } );

    it( 'should be defined', () => {
        expect( service ).toBeDefined();
    } );

    describe( 'updateStreakForUser', () => {
        it( 'should create new streak for first-time user', async () => {
            const userId = 'user-123';
            mockDataSource.manager.findOne.mockResolvedValue( null );
            mockDataSource.manager.create.mockReturnValue( {
                userId,
                currentStreak: 1,
                longestStreak: 1,
                totalStudyDays: 1,
            } );
            mockDataSource.manager.save.mockResolvedValue( {
                userId,
                currentStreak: 1,
                longestStreak: 1,
                totalStudyDays: 1,
            } );

            const result = await service.updateStreakForUser( userId );

            expect( result.currentStreak ).toBe( 1 );
            expect( result.longestStreak ).toBe( 1 );
        } );

        it( 'should increment streak for consecutive day', async () => {
            const userId = 'user-123';
            const yesterday = new Date();
            yesterday.setDate( yesterday.getDate() - 1 );
            yesterday.setHours( 0, 0, 0, 0 );

            mockDataSource.manager.findOne.mockResolvedValue( {
                userId,
                currentStreak: 5,
                longestStreak: 10,
                lastActivityDate: yesterday,
                totalStudyDays: 20,
            } );

            mockDataSource.manager.save.mockImplementation( ( entity ) => Promise.resolve( entity ) );

            const result = await service.updateStreakForUser( userId );

            expect( result.currentStreak ).toBe( 6 );
            expect( result.totalStudyDays ).toBe( 21 );
        } );

        it( 'should reset streak if broken', async () => {
            const userId = 'user-123';
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate( threeDaysAgo.getDate() - 3 );
            threeDaysAgo.setHours( 0, 0, 0, 0 );

            mockDataSource.manager.findOne.mockResolvedValue( {
                userId,
                currentStreak: 5,
                longestStreak: 10,
                lastActivityDate: threeDaysAgo,
                totalStudyDays: 20,
            } );

            mockDataSource.manager.save.mockImplementation( ( entity ) => Promise.resolve( entity ) );

            const result = await service.updateStreakForUser( userId );

            expect( result.currentStreak ).toBe( 1 );
            expect( result.totalStudyDays ).toBe( 21 );
        } );
    } );

    describe( 'getCurrentStreak', () => {
        it( 'should return 0 for non-existent streak', async () => {
            mockDataSource.manager.findOne.mockResolvedValue( null );

            const result = await service.getCurrentStreak( 'user-123' );

            expect( result ).toBe( 0 );
        } );

        it( 'should return current streak if active', async () => {
            const today = new Date();
            today.setHours( 0, 0, 0, 0 );

            mockDataSource.manager.findOne.mockResolvedValue( {
                currentStreak: 7,
                lastActivityDate: today,
            } );

            const result = await service.getCurrentStreak( 'user-123' );

            expect( result ).toBe( 7 );
        } );

        it( 'should return 0 if streak is broken', async () => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate( threeDaysAgo.getDate() - 3 );

            mockDataSource.manager.findOne.mockResolvedValue( {
                currentStreak: 7,
                lastActivityDate: threeDaysAgo,
            } );

            const result = await service.getCurrentStreak( 'user-123' );

            expect( result ).toBe( 0 );
        } );
    } );
} );
