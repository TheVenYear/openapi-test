import { Body, JsonController, Post } from "routing-controllers";
import { ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import SignInDto from "./dto/sign-in.dto";

@Service()
@JsonController("/user")
export class UserController {

  @Post()
  @ResponseSchema(SignInDto)
  signIn(@Body() signInDto: SignInDto) {
    return signInDto;
  }
}
