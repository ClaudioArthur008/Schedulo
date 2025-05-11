import { Module } from '@nestjs/common';
import { ParcoursController } from './parcours.controller';
import { ParcoursService } from './parcours.service';
import { Parcours } from './parcours.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Parcours])],
  controllers: [ParcoursController],
  providers: [ParcoursService],
})
export class ParcoursModule {}
