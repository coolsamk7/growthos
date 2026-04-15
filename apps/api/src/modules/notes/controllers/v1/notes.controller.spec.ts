import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NotesController } from './notes.controller';
import { NoteEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe('NotesController', () => {
  let controller: NotesController;
  let dataSource: DataSource;

  const mockNote = {
    id: 'note-123',
    title: 'My Note',
    content: 'Note content',
    userId: 'user-123',
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
    deletedAt: null,
  };

  const mockUser = {
    id: 'user-123',
    role: 'USER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
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
    })
      .overrideGuard(AbilitiesGuard)
      .useClass(MockAbilitiesGuard)
      .compile();

    controller = module.get<NotesController>(NotesController);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a note successfully', async () => {
      const createDto = {
        title: 'My Note',
        content: 'Note content',
      };

      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockNote);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockNote);

      const result = await controller.create(createDto, mockUser);

      expect(result.message).toBe('Created successfully');
      expect(dataSource.manager.create).toHaveBeenCalledWith(
        NoteEntity,
        expect.objectContaining({
          userId: mockUser.id,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all notes with pagination', async () => {
      const notes = [mockNote];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([notes, 1]);

      const result = await controller.findAll('1', '20', mockUser);

      expect(result.data.length).toBe(1);
      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        NoteEntity,
        expect.objectContaining({
          where: { userId: mockUser.id },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve a single note by id', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockNote);

      const result = await controller.findOne('note-123', mockUser);

      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if not found', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(controller.findOne('nonexistent', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a note successfully', async () => {
      const updateDto = {
        title: 'Updated Note',
      };

      const updatedNote = { ...mockNote, ...updateDto };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockNote);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(updatedNote);

      const result = await controller.update('note-123', updateDto, mockUser);

      expect(result.message).toBe('Updated successfully');
    });
  });

  describe('delete', () => {
    it('should soft delete a note successfully', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockNote);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      const result = await controller.delete('note-123', mockUser);

      expect(result.message).toBe('Deleted successfully');
    });
  });
});
