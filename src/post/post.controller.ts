import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Prisma, User } from '@prisma/client';
import { getUploadPath, serverUrl } from 'src/extras';
import { PaginationQuery } from './dto/PaginationQuery';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly client: PrismaService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadLocation =
            getUploadPath((req.user as User).id.toString()) + '/postImages/';

          fs.mkdirSync(uploadLocation, { recursive: true });

          cb(null, uploadLocation);
        },
        filename: (req, file, cb) => {
          const newFilename = Date.now() + file.originalname;

          cb(null, newFilename);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: User,
  ) {
    let filePath: string | null = null;
    if (file) {
      filePath = 'http://' + serverUrl + '/' + file.path;
    }

    return this.postService.create(createPostDto, filePath, user);
  }

  @Get()
  @Public()
  findAll(@Query() pagination: PaginationQuery) {
    return this.postService.findAll(pagination);
  }

  @Get('like-post/:id')
  async likePost(@Param('id') id: string, @CurrentUser() user: User) {
    try {
      const res = await this.client.like.create({
        data: {
          postId: +id,
          userId: user.id,
        },
      });
      return res;
    } catch (err) {
      throw new BadRequestException('Cannot like already liked post');
    }
    return null;
  }
  @Get('unlike-post/:id')
  async unlikePost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.client.like.delete({
      where: {
        postId_userId: {
          postId: +id,
          userId: user.id,
        },
      },
    });
    // try {
    //   const res = await this.client.like.create({
    //     data: {
    //       postId: +id,
    //       userId: user.id,
    //     },
    //   });
    //   return res;
    // } catch (err) {
    //   throw new BadRequestException('Cannot like already liked post');
    // }
    // return null;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
