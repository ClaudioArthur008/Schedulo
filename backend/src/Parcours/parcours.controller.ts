import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ParcoursService } from './parcours.service';
import { Parcours } from './parcours.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('parcours')
export class ParcoursController {
  constructor(private parcoursService: ParcoursService) {}

  @Get()
  async getAllParcours(): Promise<Parcours[]> {
    return this.parcoursService.getAllParcours();
  }

  @Post()
  async createParcours(@Body() parcours: Parcours): Promise<Parcours> {
    return this.parcoursService.createParcours(parcours);
  }

  @Put(':id')
  async updateParcours(
    @Param('id') id: number,
    @Body() parcours: Parcours,
  ): Promise<Parcours> {
    return this.parcoursService.update(id, parcours);
  }

  @Delete(':id')
  async deleteParcours(@Param('id') id: number): Promise<void> {
    return this.parcoursService.delete(id);
  }
}
