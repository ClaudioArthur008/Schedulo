import { Module } from "@nestjs/common";
import { EtudiantController } from "./etudiant.controller";
import { EtudiantService } from "./etudiant.service";
import { Etudiant } from "./etudiant.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Etudiant])],
    controllers :[EtudiantController],
    providers : [EtudiantService]
})
export class EtudiantModule{}