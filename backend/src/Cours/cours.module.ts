import { Module } from '@nestjs/common';
import { CoursController } from './cours.controller';
import { CoursService } from './cours.service';
import { Cours } from './cours.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cours])],
  controllers: [CoursController],
  providers: [CoursService],
})
export class CoursModule {}
