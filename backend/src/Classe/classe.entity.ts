import { Cours } from "src/Cours/cours.entity";
import { Niveau } from "src/Niveau/niveau.entity";
import { Parcours } from "src/Parcours/parcours.entity";
import { Etudiant } from "src/Utilisateur/Etudiant/etudiant.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Classe{
    @PrimaryColumn()
    id_parcours: number;

    @PrimaryColumn()
    id_niveau: string;

    @Column()
    groupe: group;

    @ManyToOne(()=>Parcours, (parcours)=>parcours.classe)
    parcours : Parcours;

    @ManyToOne(()=>Niveau, (niveau)=>niveau.classe)
    niveau : Niveau;

    @OneToMany(()=>Etudiant, (etudiant)=>etudiant.classe)
    etudiant :Etudiant [];

    @OneToMany(()=>Cours, (cours)=>cours.classe)
    cours : Cours[];
 
}

export enum group {
    gp1 = 1,
    gp2 = 2
}