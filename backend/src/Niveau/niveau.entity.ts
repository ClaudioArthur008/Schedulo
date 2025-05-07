import { Classe } from "../Classe/classe.entity";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Niveau{
    @PrimaryColumn()
    id_niveau : string

    @OneToMany(()=>Classe, (classe)=>classe.niveau)
    classe :Classe[]
}