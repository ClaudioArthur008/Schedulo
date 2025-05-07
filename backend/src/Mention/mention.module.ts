import { Module } from '@nestjs/common';
import { MentionController } from './mention.controller';
import { MentionService } from './module.service';

@Module({
  controllers: [MentionController],
  providers: [MentionService],
})
export class MentionModule {}
