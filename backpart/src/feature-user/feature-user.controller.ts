import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  NotFoundException,
  ParseIntPipe,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FeatureUserService } from './feature-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateMeDto } from './dto/update-me.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class FeatureUserController {
  constructor(private readonly featureUserService: FeatureUserService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUser: CreateUserDto) {
    return this.featureUserService.create(createUser);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(@Query('role') role?: string) {
    const users = await this.featureUserService.findAll(role);
    if (!users.length) {
      throw new NotFoundException('Users not found.');
      // return [];
    }
    return users;
  }

  // ===== GET /users/me =====
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@Request() req) {
    return this.featureUserService.findMe(req.user.id);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.featureUserService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  // ===== PATCH /users/me =====

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  updateMe(@Request() req, @Body() updateUser: UpdateMeDto) {
    return this.featureUserService.update(req.user.id, updateUser);
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    const user = await this.featureUserService.update(id, updateUser);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteUserDto: DeleteUserDto,
    @Request() req,
  ) {
    return this.featureUserService.remove(id, deleteUserDto, req.user.id);
  }
}
