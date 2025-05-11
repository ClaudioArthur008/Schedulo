import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Salle } from './salle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalleService {
  constructor(
    @InjectRepository(Salle)
    private salleRepository: Repository<Salle>,
  ) {}

  async createSalle(salle: Salle): Promise<Salle> {
    return this.salleRepository.save(salle);
  }

  async getAllSalle(): Promise<Salle[]> {
    return this.salleRepository.find();
  }

  async update(id_salle: string, salle: Salle): Promise<Salle> {
    const salleToUpdate = await this.salleRepository.findOneBy({
      id_salle: id_salle,
    });
    if (!salleToUpdate) {
      throw new Error('Salle introuvable');
    }
    await this.salleRepository.update(id_salle, salle);
    return salle;
  }

  async delete(id_salle: string): Promise<void> {
    const salleToDelete = await this.salleRepository.findOneBy({
      id_salle: id_salle,
    });
    if (!salleToDelete) {
      throw new Error('Salle introuvable');
    }
    await this.salleRepository.delete(id_salle);
  }
}
