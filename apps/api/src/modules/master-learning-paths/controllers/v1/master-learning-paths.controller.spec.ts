import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MasterLearningPathsController } from './master-learning-paths.controller';
import { MasterLearningPathEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'MasterLearningPathsController', () => {
  let controller: MasterLearningPathsController;
  let dataSource: DataSource;

  const mockPath = {
    id: 'path-123',
    title: 'Complete TypeScript',
    description: 'Full TypeScript course',
    isPublished: true,
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
    deletedAt: null,
  };

  const mockAdminUser = {
    id: 'admin-123',
    role: 'ADMIN',
  };

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      controllers: [ MasterLearningPathsController ],
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

    controller = module.get<MasterLearningPathsController>( MasterLearningPathsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a master learning path successfully', async () => {
      const createDto = {
        title: 'Complete TypeScript',
        description: 'Full course',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockPath );

      const result = await controller.create( createDto );

      expect( result.message ).toBe( 'Master learning path created successfully' );
    } );

    it( 'should set isPublished to true by default', async () => {
      const createDto = {
        title: 'Complete TypeScript',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockPath );

      await controller.create( createDto );

      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        MasterLearningPathEntity,
        expect.objectContaining( {
          isPublished: true,
        } )
      );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all master learning paths', async () => {
      const paths = [ mockPath ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ paths, 1 ] );

      const result = await controller.findAll( '1', '20', undefined, mockAdminUser );

      expect( result.data.length ).toBe( 1 );
    } );

    it( 'should filter by isPublished when provided', async () => {
      const paths = [ mockPath ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ paths, 1 ] );

      await controller.findAll( '1', '20', 'true', mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterLearningPathEntity,
        expect.objectContaining( {
          where: expect.objectContaining( {
            isPublished: true,
          } ),
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single path by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockPath );

      const result = await controller.findOne( 'path-123' );

      expect( result ).toEqual( mockPath );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent' ) ).rejects.toThrow( NotFoundException );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a learning path successfully', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedPath = { ...mockPath, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedPath );

      const result = await controller.update( 'path-123', updateDto );

      expect( result.message ).toBe( 'Master learning path updated successfully' );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a learning path successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockPath );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'path-123' );

      expect( result.message ).toBe( 'Master learning path deleted successfully' );
    } );
  } );
} );
