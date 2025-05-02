import { Enseignant } from "src/Utilisateur/Enseignant/enseignant.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Disponibilite{
    @PrimaryGeneratedColumn()
    id_disponibilite : number;

    @Column({type:'timestamp'})
    dispo_debut : Date;

    @Column({type:'timestamp'})
    dispo_fin : Date;
    @ManyToOne(()=>Enseignant,(enseignant)=>enseignant.disponibilite)
    @JoinColumn()
    enseignant : Enseignant;
}