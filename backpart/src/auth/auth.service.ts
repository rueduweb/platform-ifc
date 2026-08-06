import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FeatureUserService } from 'src/feature-user/feature-user.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: FeatureUserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }
    const user = await this.usersService.create(signUpDto);

    const token = this.generateToken(user.id, user.email);

    const { ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async signin(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const isPwdValid = await bcrypt.compare(signInDto.password, user.password);
    if (!isPwdValid) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const token = this.generateToken(user.id, user.email);

    const { ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  private generateToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
