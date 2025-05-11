import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Utilisateur } from '../Utilisateur/utilisateur.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id_notification: number;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.notifications)
  utilisateur: Utilisateur;
}
