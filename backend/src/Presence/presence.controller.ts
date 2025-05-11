import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { Presence, PresenceDto } from './presence.entity';
import { Etudiant } from '../Utilisateur/Etudiant/etudiant.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('presence')
export class PresenceController {
  constructor(private presenceService: PresenceService) {}

  @Get()
  async getAllPresence(): Promise<Presence[]> {
    return this.presenceService.getAllPresence();
  }

  @Get('PresenceForSpecificCours/:id')
  async getAllPresenceForSpecificCours(
    @Param('id') id: number,
  ): Promise<Presence[]> {
    return this.presenceService.getAllPresenceForSpecificCours(id);
  }

  @Get('MissedList/:id')
  async getAllMissedEtudiantDuringOneCours(
    @Param('id') id: number,
  ): Promise<Etudiant[]> {
    return this.presenceService.getAllMissedEtudiantDuringOneCours(id);
  }

  @Post()
  enregistrer(@Body() dto: PresenceDto) {
    return this.presenceService.enregistrer(dto);
  }
}
