import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MatiereClasseService } from './matiere_classe.service';
import { Matiere_Classe } from './matiere_classe.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('matiere_classe')
export class MatiereClasseController {
  constructor(private readonly matiere_classeService: MatiereClasseService) {}

  @Get()
  async getAll(): Promise<Matiere_Classe[]> {
    return await this.matiere_classeService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Matiere_Classe> {
    return await this.matiere_classeService.getOne(id);
  }

  @Post()
  async create(@Body() data: Matiere_Classe): Promise<Matiere_Classe> {
    return await this.matiere_classeService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Matiere_Classe,
  ): Promise<Matiere_Classe> {
    return await this.matiere_classeService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.matiere_classeService.remove(id);
  }
}
