import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @ApiProperty({
    default: 1,
    description: 'Pagina de productos obtenidos',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    default: 5,
    description: 'Limite de productos obtenidos',
  })
  @Min(1)
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}
