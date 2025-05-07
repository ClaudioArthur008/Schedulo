import { Matiere_Classe } from "../Matiere_Classe/matiere_classe.entity";
import { Classe } from "../Classe/classe.entity";
import { Enseignant } from "../Utilisateur/Enseignant/enseignant.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Matiere{
    @PrimaryGeneratedColumn()
    id_matiere : number;

    @Column()
    nom_matiere : string;

    @ManyToOne(()=>Enseignant, (enseignant)=> enseignant.matiere, {nullable: false})
    @JoinColumn()
    enseignant : Enseignant;
    
    @OneToMany(()=>Matiere_Classe, (matiere_classe)=> matiere_classe.matiere)
    matiere_classes : Matiere_Classe [];
}