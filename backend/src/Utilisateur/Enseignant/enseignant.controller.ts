import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EnseignantService } from './enseignant.service';
import { Enseignant } from './enseignant.entity';
import { Public } from './../../auth/decorator/public.decorator';

@Public()
@Controller('enseignant')
export class EnseignantController {
  constructor(private enseignantService: EnseignantService) {}

  @Get()
  async getAllEnseignant() {
    return this.enseignantService.findAll();
  }

  @Post()
  async createEnseignant(@Body() enseignant: Partial<Enseignant>) {
    return this.enseignantService.create(enseignant);
  }

  @Put(':id')
  async updateEnseignant(
    @Param('id') id: string,
    @Body() enseignant: Enseignant,
  ) {
    return this.enseignantService.update(id, enseignant);
  }

  @Delete(':id')
  async deleteEnseignant(id: string) {
    return this.enseignantService.remove(id);
  }
}
