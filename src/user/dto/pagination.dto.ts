import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  limit = 10;
}
