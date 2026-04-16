import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StudySessionsController } from './study-sessions.controller';
import { StudySessionEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'StudySessionsController', () => {
  let controller: StudySessionsController;
  let dataSource: DataSource;

  const mockSession = {
    id: 'session-123',
    userId: 'user-123',
    topicId: 'topic-123',
    duration: 60,
    notes: 'Studied basic concepts',
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
    deletedAt: null,
  };

  const mockUser = {
    id: 'user-123',
    role: 'USER',
  };

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      controllers: [ StudySessionsController ],
      providers: [
        {
          provide: DataSource,
          useValue: {
            manager: {
              create: vi.fn(),
              save: vi.fn(),
              findOne: vi.fn(),
              findAndCount: vi.fn(),
              softDelete: vi.fn(),
            },
          },
        },
      ],
    } )
      .overrideGuard( AbilitiesGuard )
      .useClass( MockAbilitiesGuard )
      .compile();

    controller = module.get<StudySessionsController>( StudySessionsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a study session successfully', async () => {
      const createDto = {
        topicId: 'topic-123',
        duration: 60,
        notes: 'Studied basic concepts',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockSession );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockSession );

      const result = await controller.create( createDto, mockUser );

      expect( result.message ).toBe( 'Study session created successfully' );
      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        StudySessionEntity,
        expect.objectContaining( {
          userId: mockUser.id,
        } )
      );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all study sessions with pagination', async () => {
      const sessions = [ mockSession ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ sessions, 1 ] );

      const result = await controller.findAll( '1', '20', mockUser );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        StudySessionEntity,
        expect.objectContaining( {
          where: { userId: mockUser.id },
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single session by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockSession );

      const result = await controller.findOne( 'session-123', mockUser );

      expect( result ).toEqual( mockSession );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent', mockUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a study session successfully', async () => {
      const updateDto = {
        duration: 90,
      };

      const updatedSession = { ...mockSession, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockSession );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedSession );

      const result = await controller.update( 'session-123', updateDto, mockUser );

      expect( result.message ).toBe( 'Study session updated successfully' );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a study session successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockSession );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'session-123', mockUser );

      expect( result.message ).toBe( 'Study session deleted successfully' );
    } );
  } );
} );
