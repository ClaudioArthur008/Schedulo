import { Module } from '@nestjs/common';
import { DisponibiliteController } from './disponibilite.controller';
import { DisponibiliteService } from './disponibilite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disponibilite } from './disponibilite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Disponibilite])],
  controllers: [DisponibiliteController],
  providers: [DisponibiliteService],
})
export class DisponibiliteModule {}
