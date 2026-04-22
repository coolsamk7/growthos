import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GoalsController } from './goals.controller';
import { GoalEntity } from '@growthos/nestjs-database/entities';
import { MockAbilitiesGuard } from '../../../../../test-helpers/guards.mock';
import { AbilitiesGuard } from '@growthos/nestjs-casl';
describe('GoalsController', () => {
  let controller: GoalsController;
  let dataSource: DataSource;

  const mockGoal = {
    id: 'goal-123',
    title: 'Learn TypeScript',
    description: 'Master TypeScript basics',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
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
        {
          provide: 'AbilitiesGuard',
          useValue: {
            canActivate: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    })
      .overrideGuard(AbilitiesGuard)
      .useClass(MockAbilitiesGuard)
      .compile();

    controller = module.get<GoalsController>(GoalsController);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a goal successfully', async () => {
      const createDto = {
        title: 'Learn TypeScript',
        description: 'Master TypeScript basics',
      };

      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockGoal);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockGoal);

      const result = await controller.create(createDto, mockUser);

      expect(result.message).toBe('Created successfully');
      expect(result.data).toEqual(mockGoal);
      expect(dataSource.manager.create).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          ...createDto,
          userId: mockUser.id,
        })
      );
      expect(dataSource.manager.save).toHaveBeenCalledWith(mockGoal);
    });

    it('should include userId when creating a goal', async () => {
      const createDto = {
        title: 'Learn TypeScript',
        description: 'Master TypeScript basics',
      };

      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockGoal);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockGoal);

      await controller.create(createDto, mockUser);

      expect(dataSource.manager.create).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          userId: mockUser.id,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all goals with pagination for user', async () => {
      const goals = [mockGoal];
      const total = 1;

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([goals, total]);

      const result = await controller.findAll('1', '20', mockUser);

      expect(result.data.length).toBe(1);
      expect(result.total).toBe(total);
      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: { userId: mockUser.id },
          skip: 0,
          take: 20,
          order: { createdAt: 'DESC' },
        })
      );
    });

    it('should use default pagination values', async () => {
      const goals = [mockGoal];
      const total = 1;

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([goals, total]);

      await controller.findAll(undefined, undefined, mockUser);

      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          skip: 0,
          take: 20,
        })
      );
    });

    it('should filter goals by userId for regular users', async () => {
      const goals = [mockGoal];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([goals, 1]);

      await controller.findAll('1', '20', mockUser);

      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: { userId: mockUser.id },
        })
      );
    });

    it('should return empty list when no goals found', async () => {
      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([[], 0]);

      const result = await controller.findAll('1', '20', mockUser);

      expect(result.data.length).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should handle pagination correctly', async () => {
      const goals = [mockGoal];

      vi.mocked(dataSource.manager.findAndCount).mockResolvedValueOnce([goals, 100]);

      await controller.findAll('3', '25', mockUser);

      expect(dataSource.manager.findAndCount).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          skip: 50, // (3 - 1) * 25
          take: 25,
        })
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve a single goal by id', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);

      const result = await controller.findOne('goal-123', mockUser);

      expect(result).toEqual(mockGoal);
      expect(dataSource.manager.findOne).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: {
            id: 'goal-123',
            userId: mockUser.id,
          },
        })
      );
    });

    it('should throw NotFoundException if goal not found', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(controller.findOne('nonexistent-id', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should filter by userId for regular users', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);

      await controller.findOne('goal-123', mockUser);

      expect(dataSource.manager.findOne).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
          }),
        })
      );
    });

    it('should retrieve any goal without userId filter for admin', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);

      await controller.findOne('goal-123', mockAdminUser);

      expect(dataSource.manager.findOne).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: { id: 'goal-123' },
        })
      );
    });
  });

  describe('update', () => {
    it('should update a goal successfully', async () => {
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      const updatedGoal = { ...mockGoal, ...updateDto };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(updatedGoal);

      const result = await controller.update('goal-123', updateDto, mockUser);

      expect(result.message).toBe('Updated successfully');
      expect(result.data).toEqual(updatedGoal);
      expect(dataSource.manager.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if goal not found', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(
        controller.update('nonexistent-id', updateDto, mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should filter by userId for regular users', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockGoal);

      await controller.update('goal-123', updateDto, mockUser);

      expect(dataSource.manager.findOne).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
          }),
        })
      );
    });

    it('should merge update data with existing goal', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedGoal = { ...mockGoal, ...updateDto };

      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(updatedGoal);

      await controller.update('goal-123', updateDto, mockUser);

      expect(dataSource.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockGoal,
          ...updateDto,
        })
      );
    });
  });

  describe('delete', () => {
    it('should soft delete a goal successfully', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      const result = await controller.delete('goal-123', mockUser);

      expect(result.message).toBe('Deleted successfully');
      expect(dataSource.manager.softDelete).toHaveBeenCalledWith(GoalEntity, {
        id: 'goal-123',
      });
    });

    it('should throw NotFoundException if goal not found', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(null);

      await expect(controller.delete('nonexistent-id', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should filter by userId for regular users', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      await controller.delete('goal-123', mockUser);

      expect(dataSource.manager.findOne).toHaveBeenCalledWith(
        GoalEntity,
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
          }),
        })
      );
    });

    it('should use soft delete instead of hard delete', async () => {
      vi.mocked(dataSource.manager.findOne).mockResolvedValueOnce(mockGoal);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });

      await controller.delete('goal-123', mockUser);

      expect(dataSource.manager.softDelete).toHaveBeenCalled();
      expect(dataSource.manager.save).not.toHaveBeenCalled();
    });
  });
});
