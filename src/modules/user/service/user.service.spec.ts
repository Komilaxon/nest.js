import { Test } from '@nestjs/testing';
import { UsersService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('userService', () => {
  let userService: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findAndCount: jest
              .fn()
              .mockImplementation((query: { page: number; limit: number }) => {
                return [query];
              }),

            save: jest.fn().mockImplementation((user) => [user]),
            findOne: jest.fn().mockImplementation((data) => data)
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('getUsers method', async () => {
    const query = {
      page: 1,
      limit: 10,
    };

    expect(await userService.getUsers(query)).toEqual(expect.any(Object));
  });

  it('createUser', async () => {
    const user = {
      username: 's',
      password: 's',
      age: 15,
    };

    return expect(userService.createUser(user)).rejects.toEqual(expect.any(Object))
  });

 
});
