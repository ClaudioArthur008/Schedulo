import { Injectable } from '@nestjs/common';
import { Etudiant } from './etudiant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private etudiantRepository: Repository<Etudiant>,
  ) {}

  async findAll(): Promise<Etudiant[]> {
    return this.etudiantRepository.find();
  }

  async findOne(id: string): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOneBy({ matricule: id });
    if (!etudiant) {
      throw new Error(`L'étudiant avec l'identifiant : ${id} n'existe pas`);
    }
    return etudiant;
  }

  async create(etudiant:Etudiant): Promise<Etudiant> {
    if (!etudiant.matricule) {
      throw new Error("Le matricule de l'étudiant est requis");
    }
    // const existingEtudiant = await this.findOne(etudiant.matricule);
    // if (existingEtudiant) {
    //   throw new Error(
    //     `L'étudiant avec le matricule ${etudiant.matricule} existe déjà`,
    //   );
    // }
    return this.etudiantRepository.save(etudiant);
  }

  async update(id: string, etudiant: Partial<Etudiant>): Promise<Etudiant> {
    if (!etudiant.matricule) {
      throw new Error("Le matricule de l'étudiant est requis");
    }
    const existingEtudiant = await this.findOne(etudiant.matricule);
    if (existingEtudiant) {
      throw new Error(
        `L'étudiant avec le matricule ${etudiant.matricule} existe déjà`,
      );
    }
    await this.etudiantRepository.update(id, etudiant);
    const utilisateur = await this.etudiantRepository.findOne({
      where: { matricule: id },
    });
    if (!utilisateur) {
      throw new Error(`L'étudiant avec l'identifiant : ${id} n'existe pas`);
    }
    return utilisateur;
  }

  async remove(id: string): Promise<void> {
    await this.etudiantRepository.delete(id);
  }
}
