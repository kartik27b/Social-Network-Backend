import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { PrismaService } from './prisma/prisma.service';
import { Request as ExpressRequest, Response } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
const fs = require('fs');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly client: PrismaService,
    private readonly authService: AuthService,
  ) {}

  // @Get('/video')
  // getVideo(@Req() req: ExpressRequest, @Res() res: Response) {
  //   const range = req.headers.range;
  //   if (!range) {
  //     res.status(400).send('Requires Range header');
  //   } else {
  //     // get video stats (about 61MB)
  //     const videoPath = 'assets/sample_video.mp4';
  //     const videoSize = fs.statSync(videoPath).size;

  //     // Parse Range
  //     // Example: "bytes=32324-"
  //     const CHUNK_SIZE = 10 ** 6; // 1MB
  //     const start = Number(range.replace(/\D/g, ''));
  //     const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  //     // Create headers
  //     const contentLength = end - start + 1;
  //     const headers = {
  //       'Content-Range': `bytes ${start}-${end}/${videoSize}`,
  //       'Accept-Ranges': 'bytes',
  //       'Content-Length': contentLength,
  //       'Content-Type': 'video/mp4',
  //     };

  //     // HTTP Status 206 for Partial Content
  //     res.writeHead(206, headers);

  //     // create video read stream for this particular chunk
  //     const videoStream = fs.createReadStream(videoPath, { start, end });

  //     // Stream the video chunk to the client
  //     videoStream.pipe(res);
  //   }
  // }

  @Get('/video')
  getVideo(
    @Req() req: ExpressRequest,
    @Res() res: Response,
    @Query('path') path: string,
  ) {
    // console.log('video/path', path);
    const range = req.headers.range;
    if (!range || !path) {
      res.status(400).send('Requires Range header');
    } else {
      // get video stats (about 61MB)
      const videoPath = path.substring('http://localhost:3000/'.length);
      console.log('video path = ', videoPath);
      // const videoPath = 'assets/sample_video.mp4';
      const videoSize = fs.statSync(videoPath).size;

      // Parse Range
      // Example: "bytes=32324-"
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      // Create headers
      const contentLength = end - start + 1;
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // create video read stream for this particular chunk
      const videoStream = fs.createReadStream(videoPath, { start, end });

      // Stream the video chunk to the client
      videoStream.pipe(res);
    }
  }

  // @Get()
  // async getHello() {
  //   return 'Hello world';
  // }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/loggedin')
  getHello(@Request() req: ExpressRequest, @CurrentUser() user: User) {
    console.log(user);
    return req.user;
  }

  // @Get()
  // testRoute() {
  //   const conversationHash  = "12"+Date.now();
  //   this.client.conversation.create({
  //     data: {
  //       user: {
  //         connect: {
  //           id: 3,
  //         },
  //       },
  //       sender: {
  //         connect: {
  //           id: 1,
  //         },
  //       },
  //       conversation_hash: conversationHash
  //     },
  //   });
  // }

  // // you can also register jwt guard and roles guard globally
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Get('/authorization/admin')
  // roleBasedAuthroizationAdmin(@Request() req): string {
  //   return req.user;
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User)
  // @Get('/authorization/user')
  // roleBasedAuthroizationUser(@Request() req): string {
  //   return req.user;
  // }
}
