
import { Niveau } from "../Niveau/niveau.entity";
import { Parcours } from "../Parcours/parcours.entity";
import { Etudiant } from "../Utilisateur/Etudiant/etudiant.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Matiere_Classe } from "../Matiere_Classe/matiere_classe.entity";

@Entity()
export class Classe{
    @PrimaryColumn()
    id_parcours: number;

    @PrimaryColumn()
    id_niveau: string;

    @PrimaryColumn()
    groupe: group;

    @ManyToOne(()=>Parcours, (parcours)=>parcours.classe)
    parcours : Parcours;

    @ManyToOne(()=>Niveau, (niveau)=>niveau.classe)
    niveau : Niveau;

    @OneToMany(()=>Matiere_Classe, (matiere_classe)=> matiere_classe.classe)
    matiere_classes : Matiere_Classe [];

    @OneToMany(()=>Etudiant, (etudiant)=>etudiant.classe)
    etudiant :Etudiant [];

    
}

 enum group {
    gp1 = 1,
    gp2 = 2
}