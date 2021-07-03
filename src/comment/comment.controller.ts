import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:postId')
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.create(createCommentDto, postId, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('/:postId')
  findCommentsById(@Param('postId') postId: string) {
    return this.commentService.findByPostId(postId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentService.remove(+id);
  // }
}
