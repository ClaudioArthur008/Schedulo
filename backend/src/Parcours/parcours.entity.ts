import { Classe } from '../Classe/classe.entity';
import { Mention } from '../Mention/mention.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Parcours {
  @PrimaryGeneratedColumn()
  id_parcours: number;

  @Column()
  nom_parcours: string;

  @Column()
  code_parcours: string;

  @ManyToOne(() => Mention, (mention) => mention.parcours, {
    onDelete: 'CASCADE',
  })
  mention: Mention;

  @OneToMany(() => Classe, (classe) => classe.niveau)
  classe: Classe[];
}
