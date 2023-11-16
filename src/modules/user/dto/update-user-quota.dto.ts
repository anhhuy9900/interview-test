import { IsDefined, IsInt, Min, Max } from 'class-validator';

export class UpdateUserQuotaDto {
  @IsDefined()
  @IsInt()
  userId!: number;

  @IsDefined()
  @IsInt()
  @Min(10, { message: 'Minimum quota storage is 10MB' })
  @Max(500, { message: 'Maximum quota storage is 500MB' })
  quotaLimit!: number;
}
