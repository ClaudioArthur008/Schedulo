import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MatiereService } from './matiere.service';
import { Matiere } from './matiere.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('matiere')
export class MatiereController {
  constructor(private matiereService: MatiereService) {}

  @Get()
  async getAllMatiere() {
    return this.matiereService.getAllMatiere();
  }

  @Post()
  async createMatiere(@Body() matiere: Matiere) {
    return this.matiereService.createMatiere(matiere);
  }

  @Delete(':id')
  async deleteMatiere(@Param('id') id: number) {
    return this.matiereService.delete(id);
  }
}
