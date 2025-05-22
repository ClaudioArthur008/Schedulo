import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Utilisateur } from '../Utilisateur/utilisateur.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id_notification: number;

  @Column()
  titre: string; // ex: "Cours à venir", "Annulation de cours"

  @Column('text')
  message: string; // ex: "Votre cours de mathématiques commence dans 30 minutes."

  @Column({ default: false })
  lu: boolean;

  @Column({ default: 'info' })
  type: string; // ex: "rappel", "annulation", "emploi_du_temps", "inscription", etc.

  @CreateDateColumn()
  date_creation: Date;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.notifications, {
    onDelete: 'CASCADE',
  })
  utilisateur: Utilisateur;
}
