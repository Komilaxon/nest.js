import { PaginationDto } from 'src/utils/pagination.query';

export class UserQuery extends PaginationDto {
  username?: string;
  age?: number;
}
