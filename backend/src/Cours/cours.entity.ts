import { Matiere_Classe } from "../Matiere_Classe/matiere_classe.entity";
import { Salle } from "../Salle/salle.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cours{
    @PrimaryGeneratedColumn()
    id_cours: number;

    @Column({type:'timestamp'})
    cours_debut : Date;

    @Column({type:'timestamp'})
    cours_fin : Date;

    @Column({default:0})
    status :Status;

    @Column({ unique: true })
    qrCodeToken: string;

    @ManyToOne(()=>Matiere_Classe, (matiere_classe)=> matiere_classe.cours)
    matiere_classes :Matiere_Classe;

    @ManyToOne(()=>Salle, (salle)=> salle.cours)
    salle :Salle;

}

export class CoursDTO{
    cours_debut : Date;
    cours_fin : Date;
    status :Status;
    qrCodeToken: string;
}

enum Status {
    PLANIFIER=0,
    EN_COURS =1,
    TERMINE =2,
    ANNULE =3, 
}