import { Module } from '@nestjs/common';
import { CoursController } from './cours.controller';
import { CoursService } from './cours.service';
import { Cours } from './cours.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matiere_Classe } from '../Matiere_Classe/matiere_classe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cours, Matiere_Classe])],
  controllers: [CoursController],
  providers: [CoursService],
})
export class CoursModule {}
