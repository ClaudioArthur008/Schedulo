import { Cours } from "../Cours/cours.entity";
import { Etudiant } from "../Utilisateur/Etudiant/etudiant.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Presence {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Etudiant)
  etudiant: Etudiant;

  @ManyToOne(() => Cours)
  cours: Cours;

  @Column()
  dateHeureScan: Date;
}

export class PresenceDto {
    etudiantId: string;
    id_cours: number;
    token: string;
    latitude: number;
    longitude: number;
  }
  