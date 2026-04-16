import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MasterTopicsController } from './master-topics.controller';
import { MasterTopicEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'MasterTopicsController', () => {
  let controller: MasterTopicsController;
  let dataSource: DataSource;

  const mockMasterTopic = {
    id: 'topic-123',
    title: 'TypeScript Basics',
    description: 'Learn TypeScript',
    masterLearningPathId: 'path-123',
    orderIndex: 1,
    isPublished: true,
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
    deletedAt: null,
  };

  const mockUser = {
    id: 'user-123',
    role: 'USER',
  };

  const mockAdminUser = {
    id: 'admin-123',
    role: 'ADMIN',
  };

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      controllers: [ MasterTopicsController ],
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

    controller = module.get<MasterTopicsController>( MasterTopicsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a master topic successfully', async () => {
      const createDto = {
        title: 'TypeScript Basics',
        description: 'Learn TypeScript',
        masterLearningPathId: 'path-123',
        orderIndex: 1,
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockMasterTopic );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockMasterTopic );

      const result = await controller.create( createDto );

      expect( result.message ).toBe( 'Master topic created successfully' );
      expect( result.data ).toEqual( mockMasterTopic );
    } );

    it( 'should set isPublished to true by default', async () => {
      const createDto = {
        title: 'TypeScript Basics',
        description: 'Learn TypeScript',
        masterLearningPathId: 'path-123',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockMasterTopic );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockMasterTopic );

      await controller.create( createDto );

      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          isPublished: true,
        } )
      );
    } );

    it( 'should set orderIndex to 0 if not provided', async () => {
      const createDto = {
        title: 'TypeScript Basics',
        masterLearningPathId: 'path-123',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockMasterTopic );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockMasterTopic );

      await controller.create( createDto );

      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          orderIndex: 0,
        } )
      );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all master topics without filters for admin', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      const result = await controller.findAll( '1', '20', undefined, undefined, mockAdminUser );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          where: {},
        } )
      );
    } );

    it( 'should filter by isPublished=true for regular users', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( '1', '20', undefined, undefined, mockUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          where: { isPublished: true },
        } )
      );
    } );

    it( 'should filter by masterLearningPathId when provided', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( '1', '20', 'path-123', undefined, mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          where: { masterLearningPathId: 'path-123' },
        } )
      );
    } );

    it( 'should filter by isPublished query parameter for admin', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( '1', '20', undefined, 'false', mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          where: { isPublished: false },
        } )
      );
    } );

    it( 'should apply both masterLearningPathId and isPublished filters', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( '1', '20', 'path-123', 'true', mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          where: {
            masterLearningPathId: 'path-123',
            isPublished: true,
          },
        } )
      );
    } );

    it( 'should order by orderIndex ascending then createdAt descending', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( '1', '20', undefined, undefined, mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          order: { orderIndex: 'ASC', createdAt: 'DESC' },
        } )
      );
    } );

    it( 'should use default pagination values', async () => {
      const topics = [ mockMasterTopic ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ topics, 1 ] );

      await controller.findAll( undefined, undefined, undefined, undefined, mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterTopicEntity,
        expect.objectContaining( {
          skip: 0,
          take: 20,
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single master topic by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockMasterTopic );

      const result = await controller.findOne( 'topic-123', mockAdminUser );

      expect( result ).toEqual( mockMasterTopic );
    } );

    it( 'should throw NotFoundException if topic not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent-id', mockAdminUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );

    it( 'should throw NotFoundException if user is regular and topic is not published', async () => {
      const unpublishedTopic = { ...mockMasterTopic, isPublished: false };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( unpublishedTopic );

      await expect( controller.findOne( 'topic-123', mockUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );

    it( 'should allow admin to retrieve unpublished topics', async () => {
      const unpublishedTopic = { ...mockMasterTopic, isPublished: false };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( unpublishedTopic );

      const result = await controller.findOne( 'topic-123', mockAdminUser );

      expect( result ).toEqual( unpublishedTopic );
    } );

    it( 'should allow user to retrieve published topics', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockMasterTopic );

      const result = await controller.findOne( 'topic-123', mockUser );

      expect( result ).toEqual( mockMasterTopic );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a master topic successfully', async () => {
      const updateDto = {
        title: 'Updated Title',
        isPublished: false,
      };

      const updatedTopic = { ...mockMasterTopic, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockMasterTopic );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedTopic );

      const result = await controller.update( 'topic-123', updateDto );

      expect( result.message ).toBe( 'Master topic updated successfully' );
      expect( result.data ).toEqual( updatedTopic );
    } );

    it( 'should throw NotFoundException if topic not found', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.update( 'nonexistent-id', updateDto ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a master topic successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockMasterTopic );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'topic-123' );

      expect( result.message ).toBe( 'Master topic deleted successfully' );
      expect( dataSource.manager.softDelete ).toHaveBeenCalledWith( MasterTopicEntity, {
        id: 'topic-123',
      } );
    } );

    it( 'should throw NotFoundException if topic not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.delete( 'nonexistent-id' ) ).rejects.toThrow( NotFoundException );
    } );
  } );
} );
