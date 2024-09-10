import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @Min(1)
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}
