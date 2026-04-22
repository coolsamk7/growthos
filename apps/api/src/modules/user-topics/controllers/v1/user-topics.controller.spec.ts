import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserTopicsController } from './user-topics.controller';
import { UserTopicEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'UserTopicsController', () => {
  let controller: UserTopicsController;
  let dataSource: DataSource;

  const mockUserTopic = {
    id: 'utopic-123',
    userId: 'user-123',
    masterTopicId: 'mtopic-123',
    status: 'LEARNING',
    progress: 60,
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
      controllers: [ UserTopicsController ],
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

    controller = module.get<UserTopicsController>( UserTopicsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create user topic successfully', async () => {
      const createDto = {
        masterTopicId: 'mtopic-123',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockUserTopic );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockUserTopic );

      const result = await controller.create( createDto, mockUser );

      expect( result.message ).toBe( 'User topic created successfully' );
      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        UserTopicEntity,
        expect.objectContaining( {
          userId: mockUser.id,
        } )
      );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all user topics', async () => {
      const topics = [ mockUserTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      const result = await controller.findAll( '1', '20', mockUser );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        UserTopicEntity,
        expect.objectContaining( {
          where: { userId: mockUser.id },
        } )
      );
    } );

    it( 'should filter by status when provided', async () => {
      const topics = [ mockUserTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( '1', '20', mockUser, 'LEARNING' );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        UserTopicEntity,
        expect.objectContaining( {
          where: expect.objectContaining( {
            status: 'LEARNING',
          } ),
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single user topic', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockUserTopic );

      const result = await controller.findOne( 'utopic-123', mockUser );

      expect( result ).toEqual( mockUserTopic );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent', mockUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );

  describe( 'update', () => {
    it( 'should update user topic successfully', async () => {
      const updateDto = {
        status: 'COMPLETED',
        progress: 100,
      };

      const updatedTopic = { ...mockUserTopic, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockUserTopic );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedTopic );

      const result = await controller.update( 'utopic-123', updateDto, mockUser );

      expect( result.message ).toBe( 'User topic updated successfully' );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete user topic successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockUserTopic );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'utopic-123', mockUser );

      expect( result.message ).toBe( 'User topic deleted successfully' );
    } );
  } );
} );
