import { Controller } from "@nestjs/common";
import { SalleService } from "./salle.service";

@Controller('salle')
export class SalleController{
    constructor(private salleService : SalleService){}
}