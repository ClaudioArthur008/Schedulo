import { Module } from '@nestjs/common';
import { NiveauController } from './niveau.controller';
import { NiveauService } from './niveau.service';
import { Niveau } from './niveau.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Niveau])],
  controllers: [NiveauController],
  providers: [NiveauService],
})
export class NiveauModule {}
