import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DisponibiliteService } from './disponibilite.service';
import { Disponibilite } from './disponibilite.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/public.decorator';

@Controller('disponibilite')
export class DisponibiliteController {
  constructor(private disponibiliteService: DisponibiliteService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('enseignant')
  @Post('create')
  create(@Request() req: { user: { userId: number } }, @Body() body) {
    const user = req.user;
    return this.disponibiliteService.create({
      ...body,
      enseignant: { id_utilisateur: user.userId },
    });
  }

  @Get('this-week/:id_enseignant')
  async getDisponibilityThisWeek(id_enseignant: number) {
    return this.disponibiliteService.findDisponibilityThisWeek(id_enseignant);
  }

  @Get('specific-week/:id_enseignant/:date')
  async getDisponibilityforSpecificWeek(id_enseignant: number, date: Date) {
    return this.disponibiliteService.findDisponibilityforSpecificWeek(
      id_enseignant,
      date,
    );
  }

  @Post('create')
  async createDisponibility(@Body() disponibilite: Disponibilite) {
    return this.disponibiliteService.create(disponibilite);
  }

  @Put('update/:id')
  async updateDisponibility(id: number, disponibilite: Disponibilite) {
    return this.disponibiliteService.update(id, disponibilite);
  }

  @Delete('delete/:id')
  async deleteDisponibility(id: number) {
    return this.disponibiliteService.delete(id);
  }
}
