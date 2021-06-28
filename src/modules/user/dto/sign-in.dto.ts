import { IsString } from "class-validator";

export default class SignInDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
