import { Controller } from "@nestjs/common";
import { EnseignantService } from "./enseignant.service";

@Controller('enseignant')
export class EnseignantController{
    constructor(private enseignantService : EnseignantService) {}
}