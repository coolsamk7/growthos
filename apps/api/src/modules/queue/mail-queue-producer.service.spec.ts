import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MailQueueProducerService } from './mail-queue-producer.service';

describe('MailQueueProducerService', () => {
  let service: MailQueueProducerService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: vi.fn(),
      addBulk: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getJob: vi.fn(),
      getJobs: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailQueueProducerService,
        {
          provide: getQueueToken('mail'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<MailQueueProducerService>(MailQueueProducerService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addToMailQueue', () => {
    it('should add a job to mail queue', async () => {
      const jobName = 'sendEmail';
      const data = { email: 'test@example.com', subject: 'Hello' };

      vi.mocked(mockQueue.add).mockResolvedValueOnce({
        id: 1,
        name: jobName,
        data,
      });

      const result = await service.addToMailQueue(jobName, data);

      expect(mockQueue.add).toHaveBeenCalledWith(jobName, data, {
        removeOnComplete: false,
        removeOnFail: false,
      });
      expect(result.name).toBe(jobName);
    });

    it('should add job with custom options', async () => {
      const jobName = 'sendEmail';
      const data = { email: 'test@example.com' };
      const options = { delay: 5000, attempts: 3 };

      vi.mocked(mockQueue.add).mockResolvedValueOnce({
        id: 1,
        name: jobName,
      });

      await service.addToMailQueue(jobName, data, options);

      expect(mockQueue.add).toHaveBeenCalledWith(jobName, data, {
        removeOnComplete: false,
        removeOnFail: false,
        delay: 5000,
        attempts: 3,
      });
    });

    it('should merge custom options with default options', async () => {
      const jobName = 'sendEmail';
      const data = { email: 'test@example.com' };
      const options = { priority: 10 };

      vi.mocked(mockQueue.add).mockResolvedValueOnce({ id: 1 });

      await service.addToMailQueue(jobName, data, options);

      expect(mockQueue.add).toHaveBeenCalledWith(jobName, data, {
        removeOnComplete: false,
        removeOnFail: false,
        priority: 10,
      });
    });
  });

  describe('addBulkToMailQueue', () => {
    it('should add multiple jobs to mail queue', async () => {
      const jobs = [
        { name: 'sendEmail', data: { email: 'user1@example.com' } },
        { name: 'sendEmail', data: { email: 'user2@example.com' } },
      ];

      vi.mocked(mockQueue.addBulk).mockResolvedValueOnce(jobs);

      const result = await service.addBulkToMailQueue(jobs);

      expect(mockQueue.addBulk).toHaveBeenCalledWith(jobs);
      expect(result.length).toBe(2);
    });

    it('should add bulk jobs with custom options', async () => {
      const jobs = [
        {
          name: 'sendEmail',
          data: { email: 'user1@example.com' },
          opts: { delay: 1000 },
        },
        {
          name: 'sendEmail',
          data: { email: 'user2@example.com' },
          opts: { delay: 2000 },
        },
      ];

      vi.mocked(mockQueue.addBulk).mockResolvedValueOnce(jobs);

      await service.addBulkToMailQueue(jobs);

      expect(mockQueue.addBulk).toHaveBeenCalledWith(jobs);
    });
  });

  describe('pauseMailQueue', () => {
    it('should pause the mail queue', async () => {
      await service.pauseMailQueue();

      expect(mockQueue.pause).toHaveBeenCalled();
    });
  });

  describe('resumeMailQueue', () => {
    it('should resume the mail queue', async () => {
      await service.resumeMailQueue();

      expect(mockQueue.resume).toHaveBeenCalled();
    });
  });

  describe('getMailJob', () => {
    it('should retrieve a job by id', async () => {
      const mockJob = { id: '1', name: 'sendEmail', data: { email: 'test@example.com' } };

      vi.mocked(mockQueue.getJob).mockResolvedValueOnce(mockJob);

      const result = await service.getMailJob('1');

      expect(mockQueue.getJob).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockJob);
    });

    it('should return null if job not found', async () => {
      vi.mocked(mockQueue.getJob).mockResolvedValueOnce(null);

      const result = await service.getMailJob('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getMailJobs', () => {
    it('should retrieve jobs by type', async () => {
      const mockJobs = [
        { id: '1', name: 'sendEmail', state: 'completed' },
        { id: '2', name: 'sendEmail', state: 'completed' },
      ];

      vi.mocked(mockQueue.getJobs).mockResolvedValueOnce(mockJobs);

      const result = await service.getMailJobs(['completed']);

      expect(mockQueue.getJobs).toHaveBeenCalledWith(['completed']);
      expect(result.length).toBe(2);
    });

    it('should retrieve jobs for multiple types', async () => {
      const mockJobs = [
        { id: '1', name: 'sendEmail', state: 'waiting' },
        { id: '2', name: 'sendEmail', state: 'active' },
        { id: '3', name: 'sendEmail', state: 'failed' },
      ];

      vi.mocked(mockQueue.getJobs).mockResolvedValueOnce(mockJobs);

      const result = await service.getMailJobs(['waiting', 'active', 'failed']);

      expect(mockQueue.getJobs).toHaveBeenCalledWith(['waiting', 'active', 'failed']);
      expect(result.length).toBe(3);
    });

    it('should return empty array if no jobs found', async () => {
      vi.mocked(mockQueue.getJobs).mockResolvedValueOnce([]);

      const result = await service.getMailJobs(['completed']);

      expect(result.length).toBe(0);
    });
  });
});
