import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Length,
  ValidateIf,
  IsUrl,
  Min,
  Max,
  IsString
} from 'class-validator';
import { BaseDto } from '../../../common/dto/base.dto';

export class UpdateUserDto extends BaseDto {
  constructor(body: any) {
    super(body);
    this.assignBody();
  }
  @IsString()
  @IsOptional()
  firstName!: string;

  @IsString()
  @IsOptional()
  lastName!: string;

  @IsString()
  @IsOptional()
  country!: string;

  @IsEmail(undefined, { message: 'Email is not valid' })
  @IsOptional()
  email!: string;

  @MinLength(8, { message: 'password should be at least 8 characters long' })
  @IsOptional()
  password!: string;
}
