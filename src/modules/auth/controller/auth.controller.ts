import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() user: UserDto) {
    return this.authService.register(user);
  }
  
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() user: UserDto) {
    const users = await this.authService.login(user.username, user.password);
    return users;
  }
}
