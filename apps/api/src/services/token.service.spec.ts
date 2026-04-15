import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { DataSource, IsNull } from 'typeorm';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TokenService } from './token.service';
import { RefreshTokenEntity } from '@growthos/nestjs-database/entities';

describe('TokenService', () => {
  let service: TokenService;
  let dataSource: DataSource;
  let jwtService: JwtService;

  const mockPayload = {
    id: 'user-123',
    email: 'test@example.com',
    roles: ['USER'],
  };

  const mockTokens = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: DataSource,
          useValue: {
            manager: {
              softDelete: vi.fn(),
              create: vi.fn(),
              save: vi.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    dataSource = module.get<DataSource>(DataSource);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', async () => {
      vi.mocked(jwtService.signAsync)
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 0 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });

      const result = await service.generateTokenPair(mockPayload);

      expect(result.accessToken).toBe(mockTokens.accessToken);
      expect(result.refreshToken).toBe(mockTokens.refreshToken);
    });

    it('should revoke all existing tokens before generating new refresh token', async () => {
      vi.mocked(jwtService.signAsync)
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 2 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });

      await service.generateTokenPair(mockPayload);

      expect(dataSource.manager.softDelete).toHaveBeenCalledWith(
        RefreshTokenEntity,
        {
          userId: mockPayload.id,
          deletedAt: IsNull(),
        }
      );
    });

    it('should store new refresh token in database', async () => {
      const mockRefreshToken = {
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      };

      vi.mocked(jwtService.signAsync)
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 0 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockRefreshToken);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockRefreshToken);

      await service.generateTokenPair(mockPayload);

      expect(dataSource.manager.create).toHaveBeenCalledWith(
        RefreshTokenEntity,
        expect.objectContaining({
          userId: mockPayload.id,
          token: mockTokens.refreshToken,
        })
      );
      expect(dataSource.manager.save).toHaveBeenCalled();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token', async () => {
      vi.mocked(jwtService.signAsync).mockResolvedValueOnce(mockTokens.accessToken);

      const result = await service.generateAccessToken(mockPayload);

      expect(result).toBe(mockTokens.accessToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith(mockPayload);
    });

    it('should include all payload fields in access token', async () => {
      vi.mocked(jwtService.signAsync).mockResolvedValueOnce(mockTokens.accessToken);

      const customPayload = {
        id: 'user-456',
        email: 'custom@example.com',
        roles: ['ADMIN', 'USER'],
        onboarding_incomplete: true,
      };

      await service.generateAccessToken(customPayload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(customPayload);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with 24 weeks expiration', async () => {
      vi.mocked(jwtService.signAsync).mockResolvedValueOnce(mockTokens.refreshToken);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 0 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });

      const result = await service.generateRefreshToken(mockPayload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockPayload.id },
        { expiresIn: '24weeks' }
      );
      expect(result).toBe(mockTokens.refreshToken);
    });

    it('should only include user id in refresh token payload', async () => {
      vi.mocked(jwtService.signAsync).mockResolvedValueOnce(mockTokens.refreshToken);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 0 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });

      await service.generateRefreshToken(mockPayload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockPayload.id },
        expect.any(Object)
      );
    });

    it('should save new refresh token entity', async () => {
      const mockRefreshTokenEntity = {
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      };

      vi.mocked(jwtService.signAsync).mockResolvedValueOnce(mockTokens.refreshToken);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 0 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce(mockRefreshTokenEntity);
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce(mockRefreshTokenEntity);

      await service.generateRefreshToken(mockPayload);

      expect(dataSource.manager.save).toHaveBeenCalledWith(mockRefreshTokenEntity);
    });

    it('should revoke existing tokens for same user', async () => {
      vi.mocked(jwtService.signAsync).mockResolvedValueOnce(mockTokens.refreshToken);
      vi.mocked(dataSource.manager.softDelete).mockResolvedValueOnce({ affected: 1 });
      vi.mocked(dataSource.manager.create).mockReturnValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });
      vi.mocked(dataSource.manager.save).mockResolvedValueOnce({
        token: mockTokens.refreshToken,
        userId: mockPayload.id,
      });

      await service.generateRefreshToken(mockPayload);

      expect(dataSource.manager.softDelete).toHaveBeenCalledWith(
        RefreshTokenEntity,
        {
          userId: mockPayload.id,
          deletedAt: IsNull(),
        }
      );
    });
  });
});
