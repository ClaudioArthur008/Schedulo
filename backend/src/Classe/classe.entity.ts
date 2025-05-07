import { Cours } from '../Cours/cours.entity';
import { Niveau } from '../Niveau/niveau.entity';
import { Parcours } from '../Parcours/parcours.entity';
import { Etudiant } from '../Utilisateur/Etudiant/etudiant.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Classe {
  @PrimaryColumn()
  id_parcours: number;

  @PrimaryColumn()
  id_niveau: string;

  @Column()
  groupe: group;

  @ManyToOne(() => Parcours, (parcours) => parcours.classe)
  parcours: Parcours;

  @ManyToOne(() => Niveau, (niveau) => niveau.classe)
  niveau: Niveau;

  @OneToMany(() => Etudiant, (etudiant) => etudiant.classe)
  etudiant: Etudiant[];

  @OneToMany(() => Cours, (cours) => cours.classe)
  cours: Cours[];
}

enum group {
  gp1 = 1,
  gp2 = 2,
}
