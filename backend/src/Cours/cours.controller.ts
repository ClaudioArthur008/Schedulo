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

  @Get('AllCoursThisWeek')
  async getAllCoursThisWeek(): Promise<Cours[]> {
    return this.coursService.getAllCoursThisWeek();
  }

  @Get('AllCoursForSpecificWeek')
  async getAllCoursForSpecificWeek(
    @Body('date') date: string,
  ): Promise<Cours[]> {
    return this.coursService.getCoursForSpecificWeek(date);
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
