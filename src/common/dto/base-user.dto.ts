// dto
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';

export class SignupDto extends BaseDto {
  constructor(body: any) {
    super(body);
  }

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsBoolean()
  isTermsAndConditionAccepted!: boolean;
}

// helper
