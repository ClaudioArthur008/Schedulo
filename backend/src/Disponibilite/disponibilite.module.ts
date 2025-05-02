import { Module } from "@nestjs/common";
import { DisponibiliteController } from "./disponibilite.controller";
import { DisponibiliteService } from "./disponibilite.service";

@Module({
    controllers :[DisponibiliteController],
    providers : [DisponibiliteService]
})
export class DisponibiliteModule{}