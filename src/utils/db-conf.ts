import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConf: TypeOrmModuleOptions = {
  type: process.env.TYPE as any,
  database: process.env.DB_NAME,
  host: process.env.HOST,
  port: +process.env.PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};
