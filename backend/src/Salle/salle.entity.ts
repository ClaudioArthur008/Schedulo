import { Cours } from "../Cours/cours.entity";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Salle{
    @PrimaryColumn()
    id_salle: string;

    @OneToMany(()=>Cours, (cours)=>cours.salle)
    cours : Cours[];
}