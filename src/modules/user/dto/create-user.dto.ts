import { IsDefined, IsString, IsEmail, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @Length(1, 100)
  @Expose()
  userName!: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  @Length(1, 200)
  @Expose()
  email!: string;

  @IsDefined()
  @IsString()
  @Expose()
  password!: string;
}
