import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StreaksController } from './streaks.controller';
import { StreakEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe('StreaksController', () => {
  let controller: StreaksController;
  let dataSource: DataSource;

  const mockStreak = {
    id: 'streak-123',
    userId: 'user-123',
    count: 15,
    startDate: new Date(),
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
      controllers: [StreaksController],
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

    controller = module.get<StreaksController>(StreaksController);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a streak successfully', async () => {
      const createDto = {
        count: 15,
        startDate: new Date(),
      };

      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockStreak);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockStreak);

      const result = await controller.create(createDto, mockUser);

      expect(result.message).toBe('Streak created successfully');
      expect(dataSource.manager.create).toHaveBeenCalledWith(
        StreakEntity,
        expect.objectContaining({
          userId: mockUser.id,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all streaks with pagination', async () => {
      const streaks = [mockStreak];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([streaks, 1]);

      const result = await controller.findAll('1', '20', mockUser);

      expect(result.data.length).toBe(1);
      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        StreakEntity,
        expect.objectContaining({
          where: { userId: mockUser.id },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve a single streak by id', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockStreak);

      const result = await controller.findOne('streak-123', mockUser);

      expect(result).toEqual(mockStreak);
    });

    it('should throw NotFoundException if not found', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(controller.findOne('nonexistent', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a streak successfully', async () => {
      const updateDto = {
        count: 20,
      };

      const updatedStreak = { ...mockStreak, ...updateDto };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockStreak);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(updatedStreak);

      const result = await controller.update('streak-123', updateDto, mockUser);

      expect(result.message).toBe('Streak updated successfully');
    });
  });

  describe('delete', () => {
    it('should soft delete a streak successfully', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockStreak);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      const result = await controller.delete('streak-123', mockUser);

      expect(result.message).toBe('Streak deleted successfully');
    });
  });
});
