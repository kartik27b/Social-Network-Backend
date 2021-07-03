import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, User } from '@prisma/client';
import { PostService } from 'src/post/post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly client: PrismaService,
    private readonly postService: PostService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ): Promise<Comment> {
    const post = await this.postService.findOne(+postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    return this.client.comment.create({
      data: {
        body: createCommentDto.body,
        author: {
          connect: {
            id: user.id,
          },
        },
        post: {
          connect: {
            id: post.id,
          },
        },
      },
    });
  }

  findAll(): Promise<Comment[]> {
    return this.client.comment.findMany({});
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const post = await this.postService.findOne(+postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    const data = await this.client.comment.findMany({
      where: {
        postId: +postId,
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

    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
