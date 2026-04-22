import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MasterProblemsController } from './master-problems.controller';
import { MasterProblemEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'MasterProblemsController', () => {
  let controller: MasterProblemsController;
  let dataSource: DataSource;

  const mockProblem = {
    id: 'prob-123',
    title: 'Two Sum',
    description: 'Find two numbers that add up',
    difficulty: 'EASY',
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
      controllers: [ MasterProblemsController ],
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

    controller = module.get<MasterProblemsController>( MasterProblemsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a master problem successfully', async () => {
      const createDto = {
        title: 'Two Sum',
        description: 'Find two numbers',
        difficulty: 'EASY',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockProblem );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockProblem );

      const result = await controller.create( createDto );

      expect( result.message ).toBe( 'Master problem created successfully' );
      expect( result.data ).toEqual( mockProblem );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all master problems with pagination', async () => {
      const problems = [ mockProblem ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ problems, 1 ] );

      const result = await controller.findAll( '1', '20', undefined, undefined, mockAdminUser );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterProblemEntity,
        expect.objectContaining( {
          skip: 0,
          take: 20,
        } )
      );
    } );

    it( 'should filter by difficulty when provided', async () => {
      const problems = [ mockProblem ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ problems, 1 ] );

      await controller.findAll( '1', '20', 'EASY', undefined, mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterProblemEntity,
        expect.objectContaining( {
          where: expect.objectContaining( {
            difficulty: 'EASY',
          } ),
        } )
      );
    } );

    it( 'should filter by isPublished when provided', async () => {
      const problems = [ mockProblem ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ problems, 1 ] );

      await controller.findAll( '1', '20', undefined, 'true', mockAdminUser );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        MasterProblemEntity,
        expect.objectContaining( {
          where: expect.objectContaining( {
            isPublished: true,
          } ),
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single problem by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockProblem );

      const result = await controller.findOne( 'prob-123' );

      expect( result ).toEqual( mockProblem );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent' ) ).rejects.toThrow( NotFoundException );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a problem successfully', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedProblem = { ...mockProblem, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockProblem );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedProblem );

      const result = await controller.update( 'prob-123', updateDto );

      expect( result.message ).toBe( 'Master problem updated successfully' );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a problem successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockProblem );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'prob-123' );

      expect( result.message ).toBe( 'Master problem deleted successfully' );
    } );
  } );
} );
