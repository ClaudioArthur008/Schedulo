import { Controller } from "@nestjs/common";
import { UtilisateurService } from "./utilisateur.service";

@Controller('utilisateur')
export class UtilisateurController{
    constructor(private utilisateurService : UtilisateurService) {}
}