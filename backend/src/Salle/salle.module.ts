import { Module } from '@nestjs/common';
import { SalleController } from './salle.controller';
import { SalleService } from './salle.service';
import { Salle } from './salle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Salle])],
  controllers: [SalleController],
  providers: [SalleService],
})
export class SalleModule {}
