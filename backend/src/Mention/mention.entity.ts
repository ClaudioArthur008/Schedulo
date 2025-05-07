import { Parcours } from '../Parcours/parcours.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mention {
  @PrimaryGeneratedColumn()
  id_mention: number;

  @Column()
  nom_mention: string;

  @OneToMany(() => Parcours, (parcours) => parcours.mention)
  parcours: Parcours[];
}
