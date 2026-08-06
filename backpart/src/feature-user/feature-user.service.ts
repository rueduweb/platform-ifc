import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class FeatureUserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUser: CreateUserDto): Promise<User> {
    const hashPwd = await bcrypt.hash(createUser.password, SALT_ROUNDS);

    return this.databaseService.user.create({
      data: {
        username: createUser.username,
        password: hashPwd,
        email: createUser.email,
        role: (createUser.role?.toUpperCase() as Role) ?? 'USER',
      },
    });
  }

  findAll(role?: string): Promise<User[]> {
    if (role) {
      return this.databaseService.user.findMany({
        where: {
          role: role as Role,
        },
      });
    }
    return this.databaseService.user.findMany();
  }

  findOne(id: number): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<User> {
    let hashPwd: string | undefined;
    if (updateUser.password) {
      hashPwd = await bcrypt.hash(updateUser.password, SALT_ROUNDS);
    }

    return this.databaseService.user.update({
      where: { id },
      data: {
        ...updateUser,
        password: hashPwd ?? undefined,
        role: updateUser.role
          ? (updateUser.role.toUpperCase() as Role)
          : undefined,
      },
    });
  }

  remove(id: number): Promise<User> {
    return this.databaseService.user.delete({
      where: { id },
    });
  }

  // utils check pwd
  async verifyPwd(plainPassword: string, hashPwd: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashPwd);
  }
}
