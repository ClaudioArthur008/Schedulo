import { Module } from '@nestjs/common';
import { MentionController } from './mention.controller';
import { MentionService } from './mention.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mention } from './mention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mention])],
  controllers: [MentionController],
  providers: [MentionService],
})
export class MentionModule {}
