import { Injectable } from '@nestjs/common';
import { Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RealtimeService {
  constructor(private readonly client: PrismaService) {}

  getAll(user: User) {
    return this.client.conversation.findMany({
      where: {
        OR: [
          {
            userId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        conversation_hash: true,
        messages: true,
      },
    });
  }

  createMessage(msg: string, hash: string, user: User): Promise<Message> {
    return this.client.message.create({
      data: {
        message: msg,
        conversation: {
          connect: {
            conversation_hash: hash,
          },
        },
        creator: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
  createMessageWithUserId(
    msg: string,
    hash: string,
    userId: number,
  ): Promise<Message> {
    return this.client.message.create({
      data: {
        message: msg,
        conversation: {
          connect: {
            conversation_hash: hash,
          },
        },
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
