// dto
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LoginDto } from "./login.dto";

export class SignupDto extends LoginDto {
  constructor(body: any) {
    super(body);
    this.assignBody();
  }
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsNotEmpty()
  @IsBoolean({ message: 'The terms and conditions is required' })
  isTermsAndConditionAccepted!: boolean;
}
