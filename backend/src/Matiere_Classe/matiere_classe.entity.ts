import { Cours } from '../Cours/cours.entity';
import { Classe } from '../Classe/classe.entity';
import { Matiere } from '../Matiere/matiere.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Enseignant } from '../Utilisateur/Enseignant/enseignant.entity';

@Entity()
export class Matiere_Classe {
  @PrimaryGeneratedColumn()
  id_mc: number;

  @ManyToOne(() => Matiere, (matiere) => matiere.matiere_classes)
  matiere: Matiere;

  @ManyToOne(() => Classe, (classe) => classe.matiere_classes)
  classe: Classe;

  @OneToMany(() => Cours, (cours) => cours.matiere_classes)
  cours: Cours[];

  @ManyToOne(() => Enseignant, (enseignant) => enseignant.matiere_classe, {
    nullable: false,
  })
  @JoinColumn()
  enseignant: Enseignant;
}
