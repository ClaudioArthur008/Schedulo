import { Module } from "@nestjs/common";
import { MatiereController } from "./matiere.controller";
import { MatiereService } from "./matiere.service";

@Module({
    controllers : [MatiereController],
    providers :[MatiereService]
})

export class MatiereModule{}