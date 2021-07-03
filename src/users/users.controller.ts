import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getUploadPath, serverUrl } from 'src/extras';
import { CreatePostDto } from 'src/post/dto/create-post.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import * as fs from 'fs';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Public()
  createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Get('/getall')
  @Public()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get('follow/:userId')
  followUser(@Param('userId') userId: string, @CurrentUser() user: User) {
    return this.userService.followUser(+userId, user);
  }

  @Get('/usersToFollow')
  getUsersToFollow(@CurrentUser() user: User) {
    return this.userService.getUsersToFollow(user);
  }

  @Post('/uploadProfilePic')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadLocation =
            getUploadPath((req.user as User).id.toString()) +
            '/userProfileImages/';

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
  create(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    let filePath: string | null = null;
    if (file) {
      filePath = 'http://' + serverUrl + '/' + file.path;
    }
    if (!filePath) return null;
    return this.userService.uploadProfilePic(user, filePath);
  }
}
