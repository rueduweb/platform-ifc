import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Throttle } from '@nestjs/throttler';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
}
