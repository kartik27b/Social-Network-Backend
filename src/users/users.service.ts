import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { getConversationHash } from 'src/extras';

@Injectable()
export class UsersService {
  constructor(private readonly client: PrismaService) {}

  createUser(userData: CreateUserDto): Promise<User> {
    return this.client.user.create({
      data: {
        username: userData.username,
        password: userData.password,
      },
    });
  }

  async findOne(username: string): Promise<User | null> {
    return this.client.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.client.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async followUser(userId: number, user: User): Promise<User> {
    const res = await this.findById(userId);
    if (!res) {
      throw new BadRequestException('User not found');
    }

    const conversationHash = getConversationHash(userId, user.id);

    const conversation = await this.client.conversation.findUnique({
      where: {
        conversation_hash: conversationHash,
      },
    });
    console.log(conversation);

    if (!conversation) {
      await this.client.conversation.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          receiver: {
            connect: {
              id: userId,
            },
          },
          conversation_hash: conversationHash,
        },
      });
    }

    return this.client.user.update({
      where: {
        id: user.id,
      },
      data: {
        following: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        following: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  getAll() {
    return this.client.user.findMany({});
  }

  getContacts(user: User) {
    return this.client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        following: {
          select: {
            profilePicUrl: true,
            username: true,
            id: true,
          },
        },
      },
    });
  }

  uploadProfilePic(user: User, profileUrl: string) {
    return this.client.user.update({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        profilePicUrl: true,
        role: true,
        username: true,
      },
      data: {
        profilePicUrl: profileUrl,
      },
    });
  }

  async getUsersToFollow(user: User): Promise<any> {
    const following = await this.client.user.findUnique({
      where: {
        id: Number(user.id),
      },
      select: {
        following: {
          select: {
            id: true,
          },
        },
      },
    });
    const followingIds = following?.following.map((user) => user.id);
    followingIds?.push(user.id);

    return this.client.user.findMany({
      where: {
        id: {
          notIn: followingIds,
        },
      },
      include: {
        following: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
