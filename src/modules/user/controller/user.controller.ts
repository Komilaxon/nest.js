import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from '../service/user.service';
import { Response } from 'express';
import { UserDto } from '../dto/user.dto';
import { UserQuery } from '../dto/user.query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { upload } from 'src/utils/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(@Query() query: UserQuery, @Res() res: Response) {
    const data = await this.userService.getUsers(query);
    res.status(200).json({ data });
  }

  @Get('find/:username')
  async getUserById(@Param('username') username: string) {
    return await this.userService.getUserByName(username);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Res() res: Response, @Body() user: UserDto) {
    const newUser = await this.userService.createUser(user);
    res.status(201).json({ msg: 'CREATED', data: newUser, error: false });
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, './uploads');
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${Date.now()}${file.originalname}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/^video\/(mp4|m4a)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() userDto: UserDto,
  ) {
    console.log(file);
    return { msg: 'done' };
  }
}
