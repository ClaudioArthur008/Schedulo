import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Classe } from '../../Classe/classe.entity';

@Entity()
export class Etudiant {
  @PrimaryColumn()
  matricule: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  prenom: string;

  @Column()
  titre: Titre;

  @ManyToOne(() => Classe, (classe) => classe.etudiant)
  classe: Classe;
}

enum Titre {
  Simple = 1,
  Délegué = 2,
}
