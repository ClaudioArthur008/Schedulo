import { Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Utilisateur } from '../utilisateur.entity';
import { Classe } from '../../Classe/classe.entity';

@Entity()
export class Etudiant {
  @PrimaryColumn()
  matricule: string;

  @OneToOne(() => Utilisateur, (utilisateur) => utilisateur.etudiant)
  utilisateur: Utilisateur;

  @ManyToOne(() => Classe, (classe) => classe.etudiant)
  classe: Classe;
}
