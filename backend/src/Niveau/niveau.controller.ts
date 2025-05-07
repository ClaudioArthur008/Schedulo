import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { NiveauService } from "./niveau.service";
import { Niveau } from "./niveau.entity";

@Controller('niveau')
export class NiveauController {
    constructor (private niveauService : NiveauService){}

    @Get()
    async getAllNiveau(): Promise<Niveau[]>{
        return this.niveauService.getAllNiveau();
    }

    @Post()
    async createNiveau(@Body() niveau: Niveau): Promise<Niveau> {
        return this.niveauService.createNiveau(niveau);
    }

    @Put(':id')
    async updateNiveau(@Param('id') id: string, @Body() niveau: Niveau): Promise<Niveau> {
        return this.niveauService.update(id, niveau);
    }

    @Delete(':id')
    async deleteNiveau(@Param('id') id: string): Promise<void> {
        return this.niveauService.delete(id);
    }


}