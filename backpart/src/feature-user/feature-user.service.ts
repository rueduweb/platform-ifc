import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

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

  async findMe(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        // role: false, // inutile : non sélectionné
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
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

  async remove(
    userId: number,
    deleteUserDto: DeleteUserDto,
    authenticatedUserId: number,
  ) {
    const { transferArticlesToUserId } = deleteUserDto;

    return this.databaseService.$transaction(async (tx) => {
      if (userId === authenticatedUserId) {
        throw new ForbiddenException(
          'An administrator cannot delete their own account.',
        );
      }

      // 1. Vérifier que l'utilisateur à supprimer existe
      const userToDelete = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userToDelete) {
        throw new NotFoundException('User not found.');
      }

      // 2. Ne pas supprimer le dernier utilisateur ADMIN
      if (userToDelete.role === Role.ADMIN) {
        const adminCount = await tx.user.count({
          where: {
            role: Role.ADMIN,
          },
        });

        if (adminCount <= 1) {
          throw new ForbiddenException('Cannot delete the last administrator.');
        }
      }

      // 3. Empêcher le transfert vers lui-même
      if (userId === transferArticlesToUserId) {
        throw new BadRequestException(
          'Cannot transfer articles to the user being deleted.',
        );
      }

      // 4. Vérifier que l'utilisateur destinataire existe
      const transferTarget = await tx.user.findUnique({
        where: {
          id: transferArticlesToUserId,
        },
      });

      if (!transferTarget) {
        throw new NotFoundException('Transfer target user not found.');
      }

      // 5. Le destinataire doit obligatoirement être USER
      if (transferTarget.role !== Role.USER) {
        throw new BadRequestException(
          'Articles can only be transferred to a USER.',
        );
      }

      // 6. Transférer tous les articles
      const transferResult = await tx.article.updateMany({
        where: {
          authorId: userId,
        },
        data: {
          authorId: transferArticlesToUserId,
        },
      });

      // 7. Supprimer l'utilisateur
      await tx.user.delete({
        where: {
          id: userId,
        },
      });

      // 8. Ne jamais retourner l'objet User Prisma
      return {
        message: 'User deleted successfully.',
        deletedUserId: userId,
        transferredArticlesToUserId: transferArticlesToUserId,
        transferredArticlesCount: transferResult.count,
      };
    });
  }

  // utils check pwd
  async verifyPwd(plainPassword: string, hashPwd: string): Promise<boolean> {
    const isPwdValid = await bcrypt.compare(plainPassword, hashPwd);
    return isPwdValid;
  }
}
