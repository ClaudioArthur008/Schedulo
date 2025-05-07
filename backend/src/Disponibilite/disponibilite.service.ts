import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Disponibilite } from './disponibilite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DisponibiliteService {
  constructor(
    @InjectRepository(Disponibilite)
    private readonly disponibiliteRepository: Repository<Disponibilite>,
  ) {}

  async findDisponibilityThisWeek(
    id_enseignant: number,
  ): Promise<Disponibilite[]> {
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
    );
    const endOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() + 6 - currentDate.getDay()),
    );

    return this.disponibiliteRepository
      .createQueryBuilder('disponibilite')
      .where('disponibilite.id_enseignant = :id_enseignant', { id_enseignant })
      .andWhere('disponibilite.date >= :startOfWeek', { startOfWeek })
      .andWhere('disponibilite.date <= :endOfWeek', { endOfWeek })
      .getMany();
  }

  async findDisponibilityforSpecificWeek(
    id_enseignant: number,
    date: Date,
  ): Promise<Disponibilite[]> {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(
      date.setDate(date.getDate() + 6 - date.getDay()),
    );

    return this.disponibiliteRepository
      .createQueryBuilder('disponibilite')
      .where('disponibilite.id_enseignant = :id_enseignant', { id_enseignant })
      .andWhere('disponibilite.date >= :startOfWeek', { startOfWeek })
      .andWhere('disponibilite.date <= :endOfWeek', { endOfWeek })
      .getMany();
  }

  async create(disponibilite: Disponibilite): Promise<Disponibilite> {
    return this.disponibiliteRepository.save(disponibilite);
  }

  async update(
    id: number,
    disponibilite: Disponibilite,
  ): Promise<Disponibilite> {
    await this.disponibiliteRepository.update(id, disponibilite);
    const result = await this.disponibiliteRepository.findOneBy({
      id_disponibilite: id,
    });
    if (!result) {
      throw new Error(`Disponibilite with id ${id} not found`);
    }
    return result;
  }

  async delete(id: number): Promise<void> {
    const result = await this.disponibiliteRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Disponibilite with id ${id} not found`);
    }
  }
}
