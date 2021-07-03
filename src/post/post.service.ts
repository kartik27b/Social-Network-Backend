import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQuery } from './dto/PaginationQuery';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly client: PrismaService) {}

  create(
    createPostDto: CreatePostDto,
    path: string | null,
    user: User,
  ): Promise<Post> {
    let fileFields = {};

    if (createPostDto.type === 'photo') {
      fileFields = { photoUrl: path };
    } else if (createPostDto.type === 'video') {
      fileFields = { videoUrl: path };
    }

    return this.client.post.create({
      data: {
        body: createPostDto.body,
        ...fileFields,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
      },
    });
  }

  findAll(pagination: PaginationQuery): Promise<Array<Post>> {
    let offset = 0;
    const { limit, pageNumber } = pagination;

    if (pagination.pageNumber && limit && pageNumber) {
      offset = pageNumber * limit - limit;
    }
    return this.client.post.findMany({
      skip: offset,
      take: pagination.limit,

      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicUrl: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  findOne(id: number): Promise<Post | null> {
    return this.client.post.findUnique({
      where: {
        id: id,
      },
    });
  }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
