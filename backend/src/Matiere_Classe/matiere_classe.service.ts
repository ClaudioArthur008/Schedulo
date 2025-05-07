import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Matiere_Classe } from "./matiere_classe.entity";
import { Repository } from "typeorm";

@Injectable()
export class MatiereClasseService {
    constructor(
     @InjectRepository(Matiere_Classe)
     private matiere_classeRepository: Repository<Matiere_Classe>){}
   
    async getAll(): Promise<Matiere_Classe[]>{
        return await this.matiere_classeRepository.find()
     }

    async getOne(id: number) : Promise<Matiere_Classe>{
        const mc = await this.matiere_classeRepository.findOneBy({ id_mc: id })
        if(!mc){
            throw new Error(`Donnée introuvable`);  
        }
        return mc;
    }

    async create(data : Matiere_Classe) : Promise<Matiere_Classe>{
        if(!data.matiere.id_matiere || !data.classe.id_niveau || !data.classe.id_parcours || !data.classe.groupe){
            throw new Error('Matiere ou classe manquante');
        }
        const mc = this.matiere_classeRepository.create(data);
        return await this.matiere_classeRepository.save(data);
    }

    async update(id : number, data: Partial<Matiere_Classe>) : Promise<Matiere_Classe>{
        await this.matiere_classeRepository.update(id, data);
        const mc= await this.matiere_classeRepository.findOne({where: {id_mc: id}});
        if (!mc){
            throw new Error(`Données introuvables`);
        }
        return mc
    }

    async remove(id: number): Promise<void> {
        await this.matiere_classeRepository.delete(id);
      }
    
}