import { Module } from "@nestjs/common";
import { MatiereController } from "./matiere.controller";
import { MatiereService } from "./matiere.service";
import { Matiere } from "./matiere.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Matiere])],
    controllers : [MatiereController],
    providers :[MatiereService]
})

export class MatiereModule{}