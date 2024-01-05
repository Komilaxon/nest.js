import {
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { UserQuery } from '../dto/user.query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getUsers(
    query: UserQuery,
  ): Promise<{ total: number; data: UserEntity[] }> {
    try {
      const { username, age, page, limit } = query;
      const [data, total] = await this.userRepo.findAndCount({
        where: {
          username: username ? ILike(`${username}%`) : Not(IsNull()),
          age: age ? age : Not(IsNull()),
        },
        skip: (+page - 1) * +limit,
        take: +limit,
      });

      return { total, data };
    } catch (error) {
      console.log(error);
    }
  }
  
  async getUserByName(@Param('username') username: string) {
    const user = await this.userRepo.findOne({ where: { username: username } });
    return user;
  }

  async createUser(user: UserDto): Promise<UserEntity> {
    const findedUser = await this.userRepo.findOne({
      where: { username: user.username },
    });

    if (findedUser) {
      throw new HttpException('User is already exist', HttpStatus.CONFLICT);
    }
    const data = await this.userRepo.save(user);
    return data;
  }
}
