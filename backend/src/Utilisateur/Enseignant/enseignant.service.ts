import { Injectable } from "@nestjs/common";
import { Enseignant } from "./enseignant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EnseignantService{
    save(enseignant: Promise<Enseignant>) {
        throw new Error("Method not implemented.");
    }
     constructor(
                @InjectRepository(Enseignant)
                private enseignantRepository: Repository<Enseignant>,
            ){}
        
            async findAll(): Promise<Enseignant[]>{
                return this.enseignantRepository.find();
            }
        
            async findOne(id : number): Promise<Enseignant>{
                const etudiant = await this.enseignantRepository.findOneBy({id_enseignant: id});
                if (!etudiant) {
                    throw new Error(`L'enseignant avec l'identifiant : ${id} n'existe pas`);
                }
                return etudiant;
            }

            async create(data: Partial<Enseignant>): Promise<Enseignant> {
                const enseignant = this.enseignantRepository.create(data);
                return await this.enseignantRepository.save(enseignant);
                
              }
            
              async update(id: number, enseignant: Partial<Enseignant>): Promise<Enseignant> {
                 await this.enseignantRepository.update(id, enseignant);
                 const enseignantx = await this.enseignantRepository.findOne({ where: { id_enseignant: id } });
                 if (!enseignantx) {
                     throw new Error(`L'étudiant avec l'identifiant : ${id} n'existe pas`);
                 }
                 return enseignantx;
              }
            
              async remove(id: number): Promise<void> {
                await this.enseignantRepository.delete(id);
              }
}