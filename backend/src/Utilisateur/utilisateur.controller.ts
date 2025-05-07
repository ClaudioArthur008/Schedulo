import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from './utilisateur.entity';

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private utilisateurService: UtilisateurService) {}

  @Get()
  async getAllUtilisateurs(): Promise<Utilisateur[]> {
    return this.utilisateurService.findAll();
  }

  @Get(':id')
  async getUtilisateurById(@Param('id') id: number): Promise<Utilisateur> {
    return this.utilisateurService.findOne(id);
  }

  @Post()
  async create(
    @Body() utilisateur: Partial<Utilisateur>,
  ): Promise<Utilisateur> {
    return this.utilisateurService.create(utilisateur);
  }

  @Delete(':id')
  async deleteUtilisateur(@Param('id') id: number): Promise<void> {
    return this.utilisateurService.remove(id);
  }

  @Put(':id/approve')
  async approveUtilisateur(@Param('id') id: number): Promise<Utilisateur> {
    return this.utilisateurService.approved(id);
  }
}
