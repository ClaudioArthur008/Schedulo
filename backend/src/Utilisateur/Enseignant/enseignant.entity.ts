import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Disponibilite } from '../../Disponibilite/disponibilite.entity';
import { Matiere_Classe } from '../../Matiere_Classe/matiere_classe.entity';

@Entity()
export class Enseignant {
  @PrimaryColumn()
  id_enseignant: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  prenom: string;

  @OneToMany(() => Disponibilite, (disponibilite) => disponibilite.enseignant)
  disponibilite: Disponibilite[];

  @OneToMany(
    () => Matiere_Classe,
    (matiere_classe) => matiere_classe.enseignant,
  )
  matiere_classe: Matiere_Classe[];
}
