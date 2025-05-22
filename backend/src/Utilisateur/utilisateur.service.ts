import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, Utilisateur } from './utilisateur.entity';
import { Repository } from 'typeorm';
import { Enseignant } from './Enseignant/enseignant.entity';
import { Etudiant } from './Etudiant/etudiant.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    @InjectRepository(Enseignant)
    @InjectRepository(Etudiant)
    public utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateurRepository.find();
  }

  async findByRole(role: Role): Promise<Utilisateur[]> {
    return this.utilisateurRepository.find({ where: { role } });
  }

  async findOne(id: number): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id_utilisateur: id },
      relations: ['enseignant', 'etudiant', 'etudiant.classe'],
    });
    if (!utilisateur) {
      throw new Error(`L'utilisateur avec l'identifiant : ${id} n'existe pas`);
    }
    return utilisateur;
  }

  async findByEtudiant(id: string): Promise<Utilisateur[]> {
    const utilisateur = await this.utilisateurRepository.find({
      where: {
        etudiant: { matricule: id },
      },
    });
    if (!utilisateur) {
      throw new Error(`L'utilisateur n'existe pas !`);
    }
    return utilisateur;
  }

  async create(user: Utilisateur): Promise<Utilisateur> {
    if (!user.etudiant?.matricule && !user.enseignant?.id_enseignant) {
      throw new Error(
        "L'utilisateur doit être soit un étudiant soit un enseignant",
      );
    }

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(user.mot_passe, salt);
    user.mot_passe = hash;
    return this.utilisateurRepository.save(user);
  }

  async update(id: number, user: Partial<Utilisateur>): Promise<Utilisateur> {
    if (!user.etudiant?.matricule && !user.enseignant?.id_enseignant) {
      throw new Error(
        "L'utilisateur doit être soit un étudiant soit un enseignant",
      );
    }
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
