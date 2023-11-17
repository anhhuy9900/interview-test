import { IsDefined, IsInt, Min, Max } from 'class-validator';

export class UpdateUserQuotaDto {
  @IsDefined()
  @IsInt()
  userId!: number;

  @IsDefined()
  @IsInt()
  @Min(10, { message: 'Minimum storage quota is 10MB' })
  @Max(500, { message: 'Maximum storage quota is 500MB' })
  quotaLimit!: number;
}
