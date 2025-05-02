import { Controller } from "@nestjs/common";
import { MatiereService } from "./matiere.service";

@Controller('matiere')
export class MatiereController{
    constructor(private matiereService :MatiereService){}
}