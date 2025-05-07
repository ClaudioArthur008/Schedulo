import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Utilisateur } from '../utilisateur.entity';
import { Disponibilite } from '../../Disponibilite/disponibilite.entity';
import { Matiere } from '../../Matiere/matiere.entity';

@Entity()
export class Enseignant {
  @PrimaryGeneratedColumn()
  id_enseignant: number;

  @OneToOne(() => Utilisateur, (utilisateur) => utilisateur.enseignant)
  utilisateur: Enseignant;

  @OneToMany(() => Disponibilite, (disponibilite) => disponibilite.enseignant)
  disponibilite: Disponibilite[];

  @OneToMany(() => Matiere, (matiere) => matiere.enseignant)
  matiere: Matiere[];
}
