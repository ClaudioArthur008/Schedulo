import { Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryColumnCannotBeNullableError } from "typeorm";
import { Utilisateur } from "../utilisateur.entity";
import { Classe } from "src/Classe/classe.entity";

@Entity()
export class Etudiant{
    @PrimaryColumn()
    matricule : number

    @OneToOne(()=>Utilisateur, (utilisateur)=>utilisateur.etudiant)
    utilisateur: Utilisateur

    @ManyToOne(()=>Classe, (classe)=>classe.etudiant)
    classe :Classe;
}