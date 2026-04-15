import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: vi.fn(),
      getWaitingCount: vi.fn(),
      getActiveCount: vi.fn(),
      getCompletedCount: vi.fn(),
      getFailedCount: vi.fn(),
      getJob: vi.fn(),
      drain: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getQueueToken('mail'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addMailJob', () => {
    it('should add a mail job', async () => {
      const data = { email: 'test@example.com', subject: 'Hello' };

      vi.mocked(mockQueue.add).mockResolvedValueOnce({
        id: 1,
        name: 'send-mail',
        data,
      });

      const result = await service.addMailJob(data);

      expect(mockQueue.add).toHaveBeenCalledWith('send-mail', data, undefined);
      expect(result.name).toBe('send-mail');
    });

    it('should add mail job with options', async () => {
      const data = { email: 'test@example.com' };
      const options = { delay: 3000, attempts: 3 };

      vi.mocked(mockQueue.add).mockResolvedValueOnce({
        id: 1,
        name: 'send-mail',
      });

      await service.addMailJob(data, options);

      expect(mockQueue.add).toHaveBeenCalledWith('send-mail', data, options);
    });
  });

  describe('getMailQueueInfo', () => {
    it('should return queue statistics', async () => {
      vi.mocked(mockQueue.getWaitingCount).mockResolvedValueOnce(5);
      vi.mocked(mockQueue.getActiveCount).mockResolvedValueOnce(2);
      vi.mocked(mockQueue.getCompletedCount).mockResolvedValueOnce(100);
      vi.mocked(mockQueue.getFailedCount).mockResolvedValueOnce(3);

      const result = await service.getMailQueueInfo();

      expect(result).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
      });
    });

    it('should return zero counts for empty queue', async () => {
      vi.mocked(mockQueue.getWaitingCount).mockResolvedValueOnce(0);
      vi.mocked(mockQueue.getActiveCount).mockResolvedValueOnce(0);
      vi.mocked(mockQueue.getCompletedCount).mockResolvedValueOnce(0);
      vi.mocked(mockQueue.getFailedCount).mockResolvedValueOnce(0);

      const result = await service.getMailQueueInfo();

      expect(result).toEqual({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
      });
    });
  });

  describe('removeMailJob', () => {
    it('should remove a mail job by id', async () => {
      const mockJob = {
        id: '1',
        remove: vi.fn(),
      };

      vi.mocked(mockQueue.getJob).mockResolvedValueOnce(mockJob);

      await service.removeMailJob('1');

      expect(mockQueue.getJob).toHaveBeenCalledWith('1');
      expect(mockJob.remove).toHaveBeenCalled();
    });

    it('should handle non-existent job gracefully', async () => {
      vi.mocked(mockQueue.getJob).mockResolvedValueOnce(null);

      await expect(service.removeMailJob('nonexistent')).resolves.not.toThrow();

      expect(mockQueue.getJob).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('cleanMailQueue', () => {
    it('should drain all jobs from queue', async () => {
      vi.mocked(mockQueue.drain).mockResolvedValueOnce(undefined);

      await service.cleanMailQueue();

      expect(mockQueue.drain).toHaveBeenCalled();
    });
  });
});
