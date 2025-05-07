import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Enseignant } from "./Enseignant/enseignant.entity";
import { Etudiant } from "./Etudiant/etudiant.entity";
import { Notification } from "../Notification/notification.entity";

export enum Role {
    ETUDIANT = 'etudiant',
    ENSEIGNANT = 'enseignant',
    ADMIN = 'admin'
}

@Entity()
export class Utilisateur {
    @PrimaryGeneratedColumn()
    id_utilisateur: number;

    @Column({unique: true})
    email: string;

    @Column()
    mot_passe: string;

    @Column()
    role: Role;

    @Column({default: false})
    approuve: boolean;

    @OneToOne(() => Enseignant, {nullable: true})
    @JoinColumn()
    enseignant?: Enseignant;

    @OneToOne(() => Etudiant, {nullable: true})
    @JoinColumn()
    etudiant?: Etudiant;

    @OneToMany(() => Notification, notification => notification.utilisateur)
    notifications: Notification[];
}