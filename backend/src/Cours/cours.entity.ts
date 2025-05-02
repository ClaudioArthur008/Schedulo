import { Classe } from "src/Classe/classe.entity";
import { Matiere } from "src/Matiere/matiere.entity";
import { Salle } from "src/Salle/salle.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cours{
    @PrimaryColumn()
    id_parcours: number;

    @PrimaryColumn()
    id_niveau: string;

    @PrimaryGeneratedColumn()
    id_matiere : number;

    @PrimaryColumn()
    id_salle: string;
    
    @ManyToOne(()=>Classe, (classe)=> classe.cours)
    classe :Classe;

    @ManyToOne(()=>Salle, (salle)=> salle.cours)
    salle :Salle;

    @ManyToOne(()=>Matiere, (matiere)=> matiere.cours)
    matiere :Classe;

    @Column({type:'timestamp'})
    cours_debut : Date;

    @Column({type:'timestamp'})
    cours_fin : Date;


}