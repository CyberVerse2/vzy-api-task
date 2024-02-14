// dto
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BaseDto {
  body: any;
  constructor(body: any) {
    this.body = body;
  }
  assignBody = () => Object.assign(this, this.body);
}
