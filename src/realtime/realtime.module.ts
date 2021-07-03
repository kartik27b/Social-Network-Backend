import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RealtimeGateway, RealtimeService],
  controllers: [RealtimeController],
})
export class RealtimeModule {}
