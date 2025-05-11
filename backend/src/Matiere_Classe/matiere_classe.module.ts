import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matiere_Classe } from './matiere_classe.entity';
import { MatiereClasseController } from './matiere_classe.controller';
import { MatiereClasseService } from './matiere_classe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Matiere_Classe])],
  controllers: [MatiereClasseController],
  providers: [MatiereClasseService],
})
export class MatiereClasseModule {}
