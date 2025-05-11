import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matiere } from './matiere.entity';

@Injectable()
export class MatiereService {
  constructor(
    @InjectRepository(Matiere)
    private readonly matiereRepository: Repository<Matiere>,
  ) {}

  async createMatiere(matiere: Matiere): Promise<Matiere> {
    return this.matiereRepository.save(matiere);
  }

  async getAllMatiere(): Promise<Matiere[]> {
    return this.matiereRepository.find();
  }

  async update(id: number, matiere: Matiere): Promise<Matiere> {
    const matiereToUpdate = await this.matiereRepository.findOneBy({
      id_matiere: id,
    });
    if (!matiereToUpdate) {
      throw new Error('Matiere introuvable');
    }
    await this.matiereRepository.update(id, matiere);
    return matiere;
  }

  async delete(id: number): Promise<void> {
    const matiereToDelete = await this.matiereRepository.findOneBy({
      id_matiere: id,
    });
    if (!matiereToDelete) {
      throw new Error('Matiere introuvable');
    }
    await this.matiereRepository.delete(id);
  }

  async getMatiereforEnseignant(id_enseignant: number): Promise<Matiere[]> {
    return this.matiereRepository
      .createQueryBuilder('matiere')
      .innerJoinAndSelect('matiere.enseignant', 'enseignant')
      .where('enseignant.id_enseignant = :id_enseignant', { id_enseignant })
      .getMany();
  }
}
