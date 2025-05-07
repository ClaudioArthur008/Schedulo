import { Module } from "@nestjs/common";
import { EnseignantController } from "./enseignant.controller";
import { EnseignantService } from "./enseignant.service";
import { Enseignant } from "./enseignant.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Enseignant])],
    controllers : [EnseignantController],
    providers : [EnseignantService]
})
export class EnseignantModeule{}