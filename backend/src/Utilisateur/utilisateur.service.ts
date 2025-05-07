import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur.entity';
import { Repository } from 'typeorm';
import { Enseignant } from './Enseignant/enseignant.entity';
import { Etudiant } from './Etudiant/etudiant.entity';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    @InjectRepository(Enseignant)
    @InjectRepository(Etudiant)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateurRepository.find();
  }

  async findOne(id: number): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOneBy({
      id_utilisateur: id,
    });
    if (!utilisateur) {
      throw new Error(`L'utilisateur avec l'identifiant : ${id} n'existe pas`);
    }
    return utilisateur;
  }

  async create(user: Partial<Utilisateur>): Promise<Utilisateur> {
    return this.utilisateurRepository.save(user);
  }

  async update(id: number, user: Partial<Utilisateur>): Promise<Utilisateur> {
    await this.utilisateurRepository.update(id, user);
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id_utilisateur: id },
    });
    if (!utilisateur) {
      throw new Error(`L'utilisateur avec l'identifiant : ${id} n'existe pas`);
    }
    return utilisateur;
  }

  async remove(id: number): Promise<void> {
    await this.utilisateurRepository.delete(id);
  }

  //Approuver l'inscription d'un utilisateur
  async approved(id: number): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id_utilisateur: id },
    });
    if (!utilisateur) {
      throw new Error(`L'utilisateur avec l'identifiant : ${id} n'existe pas`);
    }
    utilisateur.approuve = true;
    await this.utilisateurRepository.save(utilisateur);
    return utilisateur;
  }
}
