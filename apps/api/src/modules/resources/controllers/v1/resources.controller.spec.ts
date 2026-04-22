import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ResourcesController } from './resources.controller';
import { ResourceEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'ResourcesController', () => {
  let controller: ResourcesController;
  let dataSource: DataSource;

  const mockResource = {
    id: 'res-123',
    title: 'TypeScript Documentation',
    url: 'https://example.com',
    type: 'LINK',
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
      controllers: [ ResourcesController ],
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

    controller = module.get<ResourcesController>( ResourcesController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a resource successfully', async () => {
      const createDto = {
        title: 'TypeScript Documentation',
        url: 'https://example.com',
        type: 'LINK',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockResource );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockResource );

      const result = await controller.create( createDto );

      expect( result.message ).toBe( 'Resource created successfully' );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all resources with pagination', async () => {
      const resources = [ mockResource ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ resources, 1 ] );

      const result = await controller.findAll( '1', '20', undefined );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        ResourceEntity,
        expect.objectContaining( {
          skip: 0,
          take: 20,
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single resource by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockResource );

      const result = await controller.findOne( 'res-123' );

      expect( result ).toEqual( mockResource );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent' ) ).rejects.toThrow( NotFoundException );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a resource successfully', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedResource = { ...mockResource, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockResource );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedResource );

      const result = await controller.update( 'res-123', updateDto );

      expect( result.message ).toBe( 'Resource updated successfully' );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a resource successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockResource );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'res-123' );

      expect( result.message ).toBe( 'Resource deleted successfully' );
    } );
  } );
} );
