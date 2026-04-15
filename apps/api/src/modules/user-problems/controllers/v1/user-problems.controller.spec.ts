import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserProblemsController } from './user-problems.controller';
import { UserProblemEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';

describe('UserProblemsController', () => {
  let controller: UserProblemsController;
  let dataSource: DataSource;

  const mockUserProblem = {
    id: 'uprob-123',
    userId: 'user-123',
    masterProblemId: 'mprob-123',
    status: 'SOLVED',
    attempts: 3,
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
      controllers: [UserProblemsController],
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

    controller = module.get<UserProblemsController>(UserProblemsController);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create user problem successfully', async () => {
      const createDto = {
        masterProblemId: 'mprob-123',
      };

      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockUserProblem);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockUserProblem);

      const result = await controller.create(createDto, mockUser);

      expect(result.message).toBe('User problem created successfully');
      expect(dataSource.manager.create).toHaveBeenCalledWith(
        UserProblemEntity,
        expect.objectContaining({
          userId: mockUser.id,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all user problems', async () => {
      const problems = [mockUserProblem];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([problems, 1]);

      const result = await controller.findAll('1', '20', mockUser);

      expect(result.data.length).toBe(1);
      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        UserProblemEntity,
        expect.objectContaining({
          where: { userId: mockUser.id },
        })
      );
    });

    it('should filter by status when provided', async () => {
      const problems = [mockUserProblem];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([problems, 1]);

      await controller.findAll('1', '20', mockUser, 'SOLVED');

      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        UserProblemEntity,
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'SOLVED',
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve a single user problem', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockUserProblem);

      const result = await controller.findOne('uprob-123', mockUser);

      expect(result).toEqual(mockUserProblem);
    });

    it('should throw NotFoundException if not found', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(controller.findOne('nonexistent', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update user problem successfully', async () => {
      const updateDto = {
        status: 'REVIEWED',
        attempts: 5,
      };

      const updatedProblem = { ...mockUserProblem, ...updateDto };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockUserProblem);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(updatedProblem);

      const result = await controller.update('uprob-123', updateDto, mockUser);

      expect(result.message).toBe('User problem updated successfully');
    });
  });

  describe('delete', () => {
    it('should soft delete user problem successfully', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockUserProblem);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      const result = await controller.delete('uprob-123', mockUser);

      expect(result.message).toBe('User problem deleted successfully');
    });
  });
});
