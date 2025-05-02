import { Cours } from "src/Cours/cours.entity";
import { Enseignant } from "src/Utilisateur/Enseignant/enseignant.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Matiere{
    @PrimaryGeneratedColumn()
    id_matiere : number;

    @Column()
    nom_matiere : string;

    @ManyToOne(()=>Enseignant, (enseignant)=> enseignant.matiere)
    @JoinColumn()
    enseignant : Enseignant;

    @OneToMany(()=>Cours, (cours)=>cours.matiere)
    cours : Cours[];
}