import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly client: PrismaService) {}

  create(createPostDto: CreatePostDto, path: string | null): Promise<Post> {
    let fileFields = {};

    console.log(path);

    if (createPostDto.type === 'photo') {
      fileFields = { photoUrl: path };
    } else if (createPostDto.type === 'video') {
      fileFields = { videoUrl: path };
    }

    console.log(fileFields);

    return this.client.post.create({
      data: {
        body: createPostDto.body,
        ...fileFields,
      },
    });
  }

  findAll(): Promise<Array<Post>> {
    return this.client.post.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
