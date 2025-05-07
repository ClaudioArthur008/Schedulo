import { Module } from "@nestjs/common";
import { DisponibiliteController } from "./disponibilite.controller";
import { DisponibiliteService } from "./disponibilite.service";
import { Disponibilite } from "./disponibilite.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Disponibilite])],
    controllers :[DisponibiliteController],
    providers : [DisponibiliteService]
})
export class DisponibiliteModule{}