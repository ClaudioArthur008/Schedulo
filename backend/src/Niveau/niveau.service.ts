import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Niveau } from "./niveau.entity";

@Injectable()
export class NiveauService{
    constructor(
        @InjectRepository(Niveau)
        private readonly niveauRepository: Repository<Niveau>
    ){}

    async createNiveau(niveau: Niveau): Promise<Niveau> {
        return this.niveauRepository.save(niveau);
    }

    async getAllNiveau():Promise<Niveau[]>{
        return this.niveauRepository.find();
    }

    async update(id : string, niveau : Niveau) : Promise <Niveau>{
        const niveauToUpdate = await this.niveauRepository.findOneBy({id_niveau : id});
        if (!niveauToUpdate) {
            throw new Error('Niveau introuvable');
        }
        await this.niveauRepository.update(id, niveau);
        return niveau;
    }

    async delete (id:string): Promise<void>{
        const niveauToDelete = await this.niveauRepository.findOneBy({id_niveau : id});
        if (!niveauToDelete) {
            throw new Error('Niveau introuvable');
        }
        await this.niveauRepository.delete(id);
    }
}
    

