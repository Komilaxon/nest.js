import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserModule } from '../user.module';
import request from 'supertest';
import { after } from 'node:test';

describe('users', () => {
  let app: INestApplication;
  const userService = { find: () => ['test'], save: () => ['test']};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('getUsers', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: userService.find(),
      
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('postUser', () => {
    return request(app.getHttpServer()).post('users').expect(201).expect({
      data: userService.save(),
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
