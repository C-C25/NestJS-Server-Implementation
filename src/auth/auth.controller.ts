import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.user.dto';
import { LocalGuard } from './guard/local.guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }



  @Post('register/email')
  registerUser(
    @Body() dto: RegisterUserDto,
  ) {
    return this.authService.registerUser(dto)
  }


  @UseGuards(LocalGuard)
  @Post('login/email')
  async loginUser(@Request() req) {
    return this.authService.issuanceToken(req.user)
  }
}
