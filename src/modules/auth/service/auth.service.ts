import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UsersService } from 'src/modules/user/service/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../..//modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

Injectable();
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(user: UserDto) {
    const isExist = await this.userRepo.findOne({
      where: { username: user.username },
    });
    if (isExist) {
      throw new HttpException('User is already exist', HttpStatus.CONFLICT);
    }
    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(user.password, salt);

    const createdUser = this.userRepo.create({
      ...user,
      password: passHash,
    });

    await this.userRepo.save(createdUser);

    const payload = {
      sub: createdUser.id,
      username: createdUser.username,
    };
    return {
      users: createdUser,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async login(username: string, password: string) {
    const findedUser = await this.userRepo.findOne({ where: { username } });
    if (!findedUser) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    const comparePass = await bcrypt.compare(password, findedUser.password);
    if (!comparePass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: findedUser.id,
      username: findedUser.username,
    };

    delete findedUser.password;
    return {
      user: findedUser,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
