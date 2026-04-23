import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/email')
  registerUser(
    @Body() dto: RegisterUserDto,
  ) {
    return this.authService.registerUser(dto)
  }

  @Post('login/email')
  loginUser(@Body() dto: LoginUserDto) {
    return this.authService.loginUser(dto)
  }
}
