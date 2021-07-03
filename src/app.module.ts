import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentModule } from './comment/comment.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, PostModule, CommentModule, RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
