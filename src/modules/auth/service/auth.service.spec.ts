import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../..//modules/user/entities/user.entity';

describe('authService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation((username: { username: string }) => {
                return username;
              }),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
