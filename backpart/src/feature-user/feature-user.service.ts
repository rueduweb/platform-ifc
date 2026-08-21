import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';

const SALT_ROUNDS = 10;

type UserWithoutPassword = Omit<User, 'password'>;
type CreatedUser = Pick<User, 'id' | 'username' | 'email'>;

@Injectable()
export class FeatureUserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUser: CreateUserDto): Promise<CreatedUser> {
    const hashPwd = await bcrypt.hash(createUser.password, SALT_ROUNDS);

    const user = await this.databaseService.user.create({
      data: {
        username: createUser.username,
        password: hashPwd,
        email: createUser.email,
        role: Role.USER,
      },
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async findAll(role?: string): Promise<UserWithoutPassword[]> {
    const users = role
      ? await this.databaseService.user.findMany({
          where: {
            role: role as Role,
          },
        })
      : await this.databaseService.user.findMany();

    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number): Promise<UserWithoutPassword | null> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(
    id: number,
    updateUser: UpdateUserDto | UpdateMeDto,
  ): Promise<UserWithoutPassword> {
    let hashPwd: string | undefined;
    if (updateUser.password) {
      hashPwd = await bcrypt.hash(updateUser.password, SALT_ROUNDS);
    }

    const user = await this.databaseService.user.update({
      where: { id },
      data: {
        ...updateUser,
        password: hashPwd ?? undefined,
        role: 'role' in updateUser ? updateUser.role : undefined,
      },
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  remove(id: number): Promise<User> {
    return this.databaseService.user.delete({
      where: { id },
    });
  }

  // utils check pwd
  async verifyPwd(plainPassword: string, hashPwd: string): Promise<boolean> {
    const isPwdValid = await bcrypt.compare(plainPassword, hashPwd);
    return isPwdValid;
  }
}
