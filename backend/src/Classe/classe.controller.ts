import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ClasseService } from './classe.service';
import { Classe } from './classe.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('classe')
export class ClasseController {
  constructor(private classeService: ClasseService) {}

  @Get()
  async findAllClasse(): Promise<Classe[]> {
    return this.classeService.getAllClasse();
  }

  @Post()
  async createClasse(@Body() classe: Classe): Promise<Classe> {
    return this.classeService.createClasse(classe);
  }

  @Put(':id_parcours/:id_niveau')
  async updateClasse(
    @Param('id_parcours') id_parcours: number,
    @Param('id_niveau') id_niveau: string,
    @Body() classe: Classe,
  ): Promise<Classe> {
    return this.classeService.update(id_parcours, id_niveau, classe);
  }

  @Delete(':id_parcours/:id_niveau')
  async deleteClasse(
    @Param('id_parcours') id_parcours: number,
    @Param('id_niveau') id_niveau: string,
  ): Promise<void> {
    return this.classeService.delete(id_parcours, id_niveau);
  }
}
