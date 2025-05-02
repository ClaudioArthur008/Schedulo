import { Controller } from "@nestjs/common";
import { ParcoursService } from "./parcours.service";

@Controller('parcours')
export class ParcoursController{
    constructor(private parcoursService : ParcoursService){}
}