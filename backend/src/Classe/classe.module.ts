import { Module } from "@nestjs/common";
import { ClasseController } from "./classe.controller";
import { ClasseService } from "./classe.service";
import { Classe } from "./classe.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Classe])],
    controllers : [ClasseController],
    providers : [ClasseService]
})
export class ClasseModule{}