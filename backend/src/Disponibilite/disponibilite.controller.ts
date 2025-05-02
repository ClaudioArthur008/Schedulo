import { Controller } from "@nestjs/common";
import { DisponibiliteService } from "./disponibilite.service";

@Controller('disponibilite')
export class DisponibiliteController{
    constructor(private disponibiliteService : DisponibiliteService){}
}