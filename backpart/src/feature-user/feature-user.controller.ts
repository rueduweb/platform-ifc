import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { FeatureUserService } from './feature-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class FeatureUserController {
  constructor(private readonly featureUserService: FeatureUserService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUser: CreateUserDto) {
    const user = this.featureUserService.create(createUser);
    if (user === undefined) {
      throw new BadRequestException('Failed to create user.');
    }
    return user;
  }

  @Get()
  @HttpCode(200)
  findAll(@Query('role') role?: string) {
    const users = this.featureUserService.findAll(role);
    if (users === undefined) {
      throw new NotFoundException('Users not found.');
    }
    return users;
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number) {
    const user = this.featureUserService.findOne(id);
    if (user === undefined) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    const user = this.featureUserService.update(id, updateUser);
    if (user === undefined) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    const user = this.featureUserService.remove(id);
    if (user === undefined) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
