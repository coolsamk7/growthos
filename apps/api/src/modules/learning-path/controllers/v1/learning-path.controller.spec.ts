import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LearningPathController } from './learning-path.controller';
import { LearningPathEntity } from '@growthos/nestjs-database/entities';import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';
describe( 'LearningPathController', () => {
  let controller: LearningPathController;
  let dataSource: DataSource;

  const mockLearningPath = {
    id: 'path-123',
    title: 'Learn TypeScript',
    description: 'Comprehensive TypeScript guide',
    userId: 'user-123',
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
      controllers: [ LearningPathController ],
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

    controller = module.get<LearningPathController>( LearningPathController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a learning path successfully', async () => {
      const createDto = {
        title: 'Learn TypeScript',
        description: 'Comprehensive guide',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockLearningPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockLearningPath );

      const result = await controller.create( createDto, mockUser );

      expect( result.message ).toBe( 'Created successfully' );
      expect( result.data ).toEqual( mockLearningPath );
      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        LearningPathEntity,
        expect.objectContaining( {
          userId: mockUser.id,
        } )
      );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all learning paths with pagination', async () => {
      const paths = [ mockLearningPath ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ paths, 1 ] );

      const result = await controller.findAll( '1', '20', mockUser );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        LearningPathEntity,
        expect.objectContaining( {
          where: { userId: mockUser.id },
          skip: 0,
          take: 20,
          order: { createdAt: 'DESC' },
        } )
      );
    } );

    it( 'should filter by userId for regular users', async () => {
      const paths = [ mockLearningPath ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ paths, 1 ] );

      await controller.findAll( '1', '20', mockUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        LearningPathEntity,
        expect.objectContaining( {
          where: { userId: mockUser.id },
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single learning path by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockLearningPath );

      const result = await controller.findOne( 'path-123', mockUser );

      expect( result ).toEqual( mockLearningPath );
      expect( dataSource.manager.findOne ).toHaveBeenCalledWith(
        LearningPathEntity,
        expect.objectContaining( {
          where: {
            id: 'path-123',
            userId: mockUser.id,
          },
        } )
      );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent', mockUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a learning path successfully', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedPath = { ...mockLearningPath, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockLearningPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedPath );

      const result = await controller.update( 'path-123', updateDto, mockUser );

      expect( result.message ).toBe( 'Updated successfully' );
      expect( result.data ).toEqual( updatedPath );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect(
        controller.update( 'nonexistent', { title: 'New' }, mockUser )
      ).rejects.toThrow( NotFoundException );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a learning path successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockLearningPath );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'path-123', mockUser );

      expect( result.message ).toBe( 'Deleted successfully' );
      expect( dataSource.manager.softDelete ).toHaveBeenCalledWith( LearningPathEntity, {
        id: 'path-123',
      } );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.delete( 'nonexistent', mockUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );
} );
