import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parcours } from './parcours.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParcoursService {
  constructor(
    @InjectRepository(Parcours)
    private readonly parcoursRepository: Repository<Parcours>,
  ) {}

  async createParcours(parcours: Parcours): Promise<Parcours> {
    if (!parcours.mention.id_mention) {
      throw new Error('Mention manquante');
    }
    return this.parcoursRepository.save(parcours);
  }

  async getAllParcours(): Promise<Parcours[]> {
    return this.parcoursRepository.find();
  }

  async update(id: number, parcours: Parcours): Promise<Parcours> {
    if (!parcours.mention.id_mention) {
      throw new Error('Mention manquante');
    }
    const parcoursToUpdate = await this.parcoursRepository.findOneBy({
      id_parcours: id,
    });
    if (!parcoursToUpdate) {
      throw new Error('Parcours introuvable');
    }

    if (!parcours.mention.id_mention) {
      throw new Error('Mention manquante');
    }

    await this.parcoursRepository.update(id, parcours);
    return parcours;
  }

  async delete(id: number): Promise<void> {
    const parcoursToDelete = await this.parcoursRepository.findOneBy({
      id_parcours: id,
    });
    if (!parcoursToDelete) {
      throw new Error('Parcours introuvable');
    }
    await this.parcoursRepository.delete(id);
  }
}
