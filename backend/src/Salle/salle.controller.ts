import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SalleService } from './salle.service';
import { Salle } from './salle.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('salle')
export class SalleController {
  constructor(private salleService: SalleService) {}

  @Get()
  async findAllSalle(): Promise<Salle[]> {
    return this.salleService.getAllSalle();
  }

  @Post()
  async createSalle(@Body() salle: Salle): Promise<Salle> {
    return this.salleService.createSalle(salle);
  }

  @Put(':id_salle')
  async updateSalle(
    @Param('id_salle') id_salle: string,
    @Body() salle: Salle,
  ): Promise<Salle> {
    return this.salleService.update(id_salle, salle);
  }

  @Delete(':id_salle')
  async deleteSalle(@Param('id_salle') id_salle: string): Promise<void> {
    return this.salleService.delete(id_salle);
  }
}
