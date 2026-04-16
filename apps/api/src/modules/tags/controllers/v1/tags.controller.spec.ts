import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TagsController } from './tags.controller';
import { TagEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe( 'TagsController', () => {
  let controller: TagsController;
  let dataSource: DataSource;

  const mockTag = {
    id: 'tag-123',
    name: 'TypeScript',
    description: 'TypeScript language tag',
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
    deletedAt: null,
  };

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      controllers: [ TagsController ],
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

    controller = module.get<TagsController>( TagsController );
    dataSource = module.get<DataSource>( DataSource );
  } );

  afterEach( () => {
    vi.clearAllMocks();
  } );

  describe( 'create', () => {
    it( 'should create a tag successfully', async () => {
      const createDto = {
        name: 'TypeScript',
        description: 'TypeScript language tag',
      };

      vi.mocked( dataSource.manager.create ).mockReturnValueOnce( mockTag );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( mockTag );

      const result = await controller.create( createDto );

      expect( result.message ).toBe( 'Tag created successfully' );
      expect( result.data ).toEqual( mockTag );
    } );
  } );

  describe( 'findAll', () => {
    it( 'should retrieve all tags with pagination', async () => {
      const tags = [ mockTag ];

      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ tags, 1 ] );

      const result = await controller.findAll( '1', '20' );

      expect( result.data.length ).toBe( 1 );
      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        TagEntity,
        expect.objectContaining( {
          skip: 0,
          take: 20,
        } )
      );
    } );

    it( 'should use default pagination values', async () => {
      vi.mocked( dataSource.manager.findAndCount ).mockResolvedValueOnce( [ [ mockTag ], 1 ] );

      await controller.findAll( undefined, undefined );

      expect( dataSource.manager.findAndCount ).toHaveBeenCalledWith(
        TagEntity,
        expect.objectContaining( {
          skip: 0,
          take: 20,
        } )
      );
    } );
  } );

  describe( 'findOne', () => {
    it( 'should retrieve a single tag by id', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockTag );

      const result = await controller.findOne( 'tag-123' );

      expect( result ).toEqual( mockTag );
    } );

    it( 'should throw NotFoundException if not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.findOne( 'nonexistent' ) ).rejects.toThrow( NotFoundException );
    } );
  } );

  describe( 'update', () => {
    it( 'should update a tag successfully', async () => {
      const updateDto = {
        name: 'Updated Name',
      };

      const updatedTag = { ...mockTag, ...updateDto };

      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockTag );
      vi.mocked( dataSource.manager.save ).mockResolvedValueOnce( updatedTag );

      const result = await controller.update( 'tag-123', updateDto );

      expect( result.message ).toBe( 'Tag updated successfully' );
    } );

    it( 'should throw NotFoundException if tag to update not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.update( 'nonexistent', { name: 'New' } ) ).rejects.toThrow(
        NotFoundException
      );
    } );
  } );

  describe( 'delete', () => {
    it( 'should soft delete a tag successfully', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( mockTag );
      vi.mocked( dataSource.manager.softDelete ).mockResolvedValueOnce( { affected: 1 } );

      const result = await controller.delete( 'tag-123' );

      expect( result.message ).toBe( 'Tag deleted successfully' );
      expect( dataSource.manager.softDelete ).toHaveBeenCalledWith( TagEntity, {
        id: 'tag-123',
      } );
    } );

    it( 'should throw NotFoundException if tag to delete not found', async () => {
      vi.mocked( dataSource.manager.findOne ).mockResolvedValueOnce( null );

      await expect( controller.delete( 'nonexistent' ) ).rejects.toThrow( NotFoundException );
    } );
  } );
} );
