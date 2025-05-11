import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DisponibiliteService } from './disponibilite.service';
import { Disponibilite } from './disponibilite.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('disponibilite')
export class DisponibiliteController {
  constructor(private disponibiliteService: DisponibiliteService) {}

  @Get()
  async getAllDisponibility() {
    return this.disponibiliteService.findAll();
  }

  @Get('this-week/:id_enseignant')
  async getDisponibilityThisWeek(
    @Param('id_enseignant') id_enseignant: number,
  ) {
    return this.disponibiliteService.findDisponibilityThisWeek(id_enseignant);
  }

  @Get('specific-week/:id_enseignant')
  async getDisponibilityforSpecificWeek(
    @Param('id_enseignant') id_enseignant: number,
    @Query('date') date: string,
  ) {
    return this.disponibiliteService.findDisponibilityforSpecificWeek(
      id_enseignant,
      date,
    );
  }

  @Post()
  async createDisponibility(@Body() disponibilite: Disponibilite) {
    return this.disponibiliteService.create(disponibilite);
  }

  @Put(':id')
  async updateDisponibility(
    @Param('id') id: number,
    @Body() disponibilite: Disponibilite,
  ) {
    return this.disponibiliteService.update(id, disponibilite);
  }

  @Delete(':id')
  async deleteDisponibility(@Param('id') id: number) {
    return this.disponibiliteService.delete(id);
  }
}
