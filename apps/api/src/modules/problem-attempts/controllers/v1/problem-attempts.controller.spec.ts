import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProblemAttemptsController } from './problem-attempts.controller';
import { ProblemAttemptEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe('ProblemAttemptsController', () => {
  let controller: ProblemAttemptsController;
  let dataSource: DataSource;

  const mockAttempt = {
    id: 'attempt-123',
    userId: 'user-123',
    problemId: 'prob-123',
    status: 'SUBMITTED',
    score: 100,
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
      controllers: [ProblemAttemptsController],
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

    controller = module.get<ProblemAttemptsController>(ProblemAttemptsController);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a problem attempt successfully', async () => {
      const createDto = {
        problemId: 'prob-123',
        code: 'solution code',
      };

      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockAttempt);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockAttempt);

      const result = await controller.create(createDto, mockUser);

      expect(result.message).toBe('Created successfully');
      expect(dataSource.manager.create).toHaveBeenCalledWith(
        ProblemAttemptEntity,
        expect.objectContaining({
          userId: mockUser.id,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all attempts with pagination', async () => {
      const attempts = [mockAttempt];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([attempts, 1]);

      const result = await controller.findAll('1', '20', mockUser);

      expect(result.data.length).toBe(1);
      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        ProblemAttemptEntity,
        expect.objectContaining({
          where: { userId: mockUser.id },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve a single attempt by id', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockAttempt);

      const result = await controller.findOne('attempt-123', mockUser);

      expect(result).toEqual(mockAttempt);
    });

    it('should throw NotFoundException if not found', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(controller.findOne('nonexistent', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update an attempt successfully', async () => {
      const updateDto = {
        status: 'ACCEPTED',
      };

      const updatedAttempt = { ...mockAttempt, ...updateDto };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockAttempt);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(updatedAttempt);

      const result = await controller.update('attempt-123', updateDto, mockUser);

      expect(result.message).toBe('Updated successfully');
    });
  });

  describe('delete', () => {
    it('should soft delete an attempt successfully', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockAttempt);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      const result = await controller.delete('attempt-123', mockUser);

      expect(result.message).toBe('Deleted successfully');
    });
  });
});
