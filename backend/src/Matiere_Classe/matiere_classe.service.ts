import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Matiere_Classe } from './matiere_classe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatiereClasseService {
  constructor(
    @InjectRepository(Matiere_Classe)
    private matiere_classeRepository: Repository<Matiere_Classe>,
  ) {}

  async getAll(): Promise<Matiere_Classe[]> {
    return await this.matiere_classeRepository.find();
  }

  async getOne(id: number): Promise<Matiere_Classe> {
    const mc = await this.matiere_classeRepository.findOneBy({ id_mc: id });
    if (!mc) {
      throw new Error(`Donnée introuvable`);
    }
    return mc;
  }

  async create(data: Matiere_Classe): Promise<Matiere_Classe> {
    if (
      !data.matiere?.id_matiere ||
      !data.classe?.id_niveau ||
      !data.classe?.id_parcours ||
      !data.classe?.groupe
    ) {
      throw new Error('Matiere ou classe manquante');
    }
    if (!data.enseignant?.id_enseignant) {
      throw new Error('Enseignant manquant');
    }
    const mc = this.matiere_classeRepository.create(data);
    return await this.matiere_classeRepository.save(data);
  }

  async update(id: number, data: Matiere_Classe): Promise<Matiere_Classe> {
    if (
      !data.matiere?.id_matiere ||
      !data.classe?.id_niveau ||
      !data.classe?.id_parcours ||
      !data.classe?.groupe
    ) {
      throw new Error('Matiere ou classe manquante');
    }
    if (!data.enseignant?.id_enseignant) {
      throw new Error('Enseignant manquant');
    }
    await this.matiere_classeRepository.update(id, data);
    const mc = await this.matiere_classeRepository.findOne({
      where: { id_mc: id },
    });
    if (!mc) {
      throw new Error(`Données introuvables`);
    }
    return mc;
  }

  async remove(id: number): Promise<void> {
    await this.matiere_classeRepository.delete(id);
  }

  async getMatiereforEnseignant(
    id_enseignant: string,
  ): Promise<Matiere_Classe[]> {
    return this.matiere_classeRepository
      .createQueryBuilder('matiere_classe')
      .innerJoinAndSelect('matiere_classe.enseignant', 'enseignant')
      .innerJoinAndSelect('matiere_classe.matiere', 'matiere')
      .innerJoinAndSelect('matiere_classe.classe', 'classe')
      .innerJoinAndSelect('classe.parcours', 'parcours')
      .where('enseignant.id_enseignant = :id_enseignant', { id_enseignant })
      .getMany();
  }

  async getEtudiantMatiere(id_enseignant: string): Promise<Matiere_Classe[]> {
    return await this.matiere_classeRepository
      .createQueryBuilder('matiere_classe')
      .innerJoin('matiere_classe.enseignant', 'enseignant')
      .innerJoin('matiere_classe.classe', 'classe')
      .innerJoin(
        'etudiant',
        'etudiant',
        'etudiant.classeIdParcours = classe.id_parcours AND etudiant.classeIdNiveau = classe.id_niveau AND etudiant.classeGroupe = classe.groupe',
      )
      .where('enseignant.id_enseignant = :id_enseignant', { id_enseignant })
      .select('*')
      .getRawMany();
  }
}
