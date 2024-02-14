// dto
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { BaseDto } from '../../../common/dto/base.dto';

export class LoginDto extends BaseDto {
  constructor(body: any) {
    super(body);
    this.assignBody();
  }

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Email is not valid' })
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword(undefined, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password!: string;
}

// helper
