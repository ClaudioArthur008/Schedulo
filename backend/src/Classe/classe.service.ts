import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classe } from './classe.entity';

@Injectable()
export class ClasseService {
  constructor(
    @InjectRepository(Classe)
    private classeRepository: Repository<Classe>,
  ) {}

  async createClasse(classe: Classe): Promise<Classe> {
    if (!classe.parcours.id_parcours || !classe.niveau.id_niveau) {
      throw new Error('Parcours ou niveau manquant');
    }
    return this.classeRepository.save(classe);
  }

  async getAllClasse(): Promise<Classe[]> {
    return this.classeRepository.find();
  }

  async update(
    id_parcours: number,
    id_niveau: string,
    classe: Classe,
  ): Promise<Classe> {
    const classeToUpdate = await this.classeRepository.findOneBy({
      id_parcours: id_parcours,
      id_niveau: id_niveau,
    });
    if (!classeToUpdate) {
      throw new Error('Classe introuvable');
    }

    if (!classe.parcours.id_parcours || !classe.niveau.id_niveau) {
      throw new Error('Parcours ou niveau manquant');
    }

    await this.classeRepository.update(
      { id_parcours: id_parcours, id_niveau: id_niveau },
      classe,
    );
    return classe;
  }

  async delete(id_parcours: number, id_niveau: string): Promise<void> {
    const classeToDelete = await this.classeRepository.findOneBy({
      id_parcours: id_parcours,
      id_niveau: id_niveau,
    });
    if (!classeToDelete) {
      throw new Error('Classe introuvable');
    }
    await this.classeRepository.delete({
      id_parcours: id_parcours,
      id_niveau: id_niveau,
    });
  }
}
