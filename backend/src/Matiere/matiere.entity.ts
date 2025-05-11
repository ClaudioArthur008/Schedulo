import { Matiere_Classe } from '../Matiere_Classe/matiere_classe.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Matiere {
  @PrimaryGeneratedColumn()
  id_matiere: number;

  @Column()
  nom_matiere: string;

  @OneToMany(() => Matiere_Classe, (matiere_classe) => matiere_classe.matiere)
  matiere_classes: Matiere_Classe[];
}
