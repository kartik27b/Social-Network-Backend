import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RealtimeService } from './realtime.service';

@Controller('/conversations')
@UseGuards(JwtAuthGuard)
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Get('all')
  getAll(@CurrentUser() user: User) {
    return this.realtimeService.getAll(user);
  }

  @Post('create')
  createMessage(@Body() createMessageDto: any, @CurrentUser() user: User) {
    const { msg, hash } = createMessageDto;
    return this.realtimeService.createMessage(msg, hash, user);
  }
}
