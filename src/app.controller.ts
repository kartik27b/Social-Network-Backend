import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { PrismaService } from './prisma/prisma.service';
import { Request, Response } from 'express';
const fs = require('fs');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly client: PrismaService,
  ) {}

  // @Get('/video')
  // getVideo(@Req() req: Request, @Res() res: Response) {
  //   const range = req.headers.range;
  //   if (!range) {
  //     res.status(400).send('Requires Range header');
  //   }

  //   // get video stats (about 61MB)
  //   const videoPath = 'assets/sample_video.mp4';
  //   const videoSize = fs.statSync(videoPath).size;

  //   // Parse Range
  //   // Example: "bytes=32324-"
  //   const CHUNK_SIZE = 10 ** 6; // 1MB
  //   const start = Number(range.replace(/\D/g, ''));
  //   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  //   // Create headers
  //   const contentLength = end - start + 1;
  //   const headers = {
  //     'Content-Range': `bytes ${start}-${end}/${videoSize}`,
  //     'Accept-Ranges': 'bytes',
  //     'Content-Length': contentLength,
  //     'Content-Type': 'video/mp4',
  //   };

  //   // HTTP Status 206 for Partial Content
  //   res.writeHead(206, headers);

  //   // create video read stream for this particular chunk
  //   const videoStream = fs.createReadStream(videoPath, { start, end });

  //   // Stream the video chunk to the client
  //   videoStream.pipe(res);
  // }

  @Get()
  async getHello() {
    return 'Hello world';
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
          const newFilename = Date.now() + file.originalname;

          cb(null, newFilename);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
