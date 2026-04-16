import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserLearningPathsController } from './user-learning-paths.controller';
import { UserLearningPathEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'UserLearningPathsController', () => {
  let controller: UserLearningPathsController;
  let dataSource: DataSource;

  const mockUserPath = {
    id: 'upath-123',
    userId: 'user-123',
    masterLearningPathId: 'mpath-123',
    status: 'IN_PROGRESS',
    progress: 50,
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
      controllers: [ UserLearningPathsController ],
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

    controller = module.get<UserLearningPathsController>( UserLearningPathsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create user learning path successfully', async () => {
      const createDto = {
        masterLearningPathId: 'mpath-123',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockUserPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockUserPath );

      const result = await controller.create( createDto, mockUser );

      expect( result.message ).toBe( 'User learning path created successfully' );
      expect( dataSource.manager.create ).toHaveBeenCalledWith(
        UserLearningPathEntity,
        expect.objectContaining( {
          userId: mockUser.id,
        } )
      );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all user learning paths', async () => {
      const paths = [ mockUserPath ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ paths, 1 ] );

      const result = await controller.findAll( '1', '20', mockUser );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        UserLearningPathEntity,
        expect.objectContaining( {
          where: { userId: mockUser.id },
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single user learning path', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockUserPath );

      const result = await controller.findOne( 'upath-123', mockUser );

      expect( result ).toEqual( mockUserPath );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent', mockUser ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );

  describe( 'update', () => {
    it( 'should update user learning path successfully', async () => {
      const updateDto = {
        status: 'COMPLETED',
        progress: 100,
      };

      const updatedPath = { ...mockUserPath, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockUserPath );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedPath );

      const result = await controller.update( 'upath-123', updateDto, mockUser );

      expect( result.message ).toBe( 'User learning path updated successfully' );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete user learning path successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockUserPath );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'upath-123', mockUser );

      expect( result.message ).toBe( 'User learning path deleted successfully' );
    } );
  } );
} );
