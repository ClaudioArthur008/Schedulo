import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CoursService } from './cours.service';
import { Cours, CoursDTO } from './cours.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('cours')
export class CoursController {
  constructor(private coursService: CoursService) {}

  @Get()
  async getAllCours(): Promise<Cours[]> {
    return this.coursService.getAllCours();
  }

  @Get('AllCoursThisWeek/:id_parcours/:id_niveau/:groupe')
  async getAllCoursThisWeek( @Param('id_parcours')id_parcours : number,  @Param('id_niveau')id_niveau: string, @Param('groupe')groupe: string): Promise<Cours[]> {
    return this.coursService.getAllCoursThisWeek(id_parcours, id_niveau, groupe);
  }

  @Get('AllCoursForSpecificWeek')
  async getAllCoursForSpecificWeek(
    @Body('date') date: string,
  ): Promise<Cours[]> {
    return this.coursService.getCoursForSpecificWeek(date);
  }

  @Get('currentTimeCours/:id_parcours/:id_niveau/:groupe')
  async getCurrentTimeCours(@Param('id_parcours') id_parcours: number, @Param('id_niveau') id_niveau: string, @Param('groupe') groupe: string): Promise<any> {
    return this.coursService.getCurrentTimeCours(id_parcours, id_niveau, groupe);
  }

  @Post()
  async createCours(
    @Body() coursDto: CoursDTO,
  ): Promise<{ cours: Cours; qrCode: string }> {
    return this.coursService.createCours(coursDto);
  }

  @Put(':id')
  async updateCours(
    @Param('id') id: number,
    @Body() cours: Cours,
  ): Promise<Cours> {
    return this.coursService.update(id, cours);
  }

  @Delete()
  async deleteCours(@Param('id') id: number): Promise<void> {
    return this.coursService.delete(id);
  }
}
