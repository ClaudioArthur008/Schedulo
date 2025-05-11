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

  async findAll(): Promise<Disponibilite[]> {
    return this.disponibiliteRepository.find();
  }

  async findDisponibilityThisWeek(
    id_enseignant: number,
  ): Promise<Disponibilite[]> {
    const currentDate = new Date();

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const startDateStr = startOfWeek.toISOString().slice(0, 10);
    const endDateStr = endOfWeek.toISOString().slice(0, 10);

    console.log('Start of Week: ', startDateStr);
    console.log('End of Week: ', endDateStr);

    const query = this.disponibiliteRepository
      .createQueryBuilder('disponibilite')
      .where('disponibilite."enseignantIdEnseignant" = :id_enseignant', {
        id_enseignant,
      })
      .andWhere('disponibilite.dispo_fin::date >= :startDate', {
        startDate: startDateStr,
      })
      .andWhere('disponibilite.dispo_debut::date <= :endDate', {
        endDate: endDateStr,
      });

    console.log('SQL: ', query.getSql());
    return query.getMany();
  }

  async findDisponibilityforSpecificWeek(
    id_enseignant: number,
    dateparam: string,
  ): Promise<Disponibilite[]> {
    const date = new Date(dateparam);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (7 - date.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const startDateStr = startOfWeek.toISOString().slice(0, 10);
    const endDateStr = endOfWeek.toISOString().slice(0, 10);
    console.log('Start of Week: ', startDateStr);
    console.log('End of Week: ', endDateStr);
    return this.disponibiliteRepository
      .createQueryBuilder('disponibilite')
      .where('disponibilite."enseignantIdEnseignant" = :id_enseignant', {
        id_enseignant,
      })
      .andWhere('disponibilite.dispo_fin::date >= :startDate', {
        startDate: startDateStr,
      })
      .andWhere('disponibilite.dispo_debut::date <= :endDate', {
        endDate: endDateStr,
      })
      .getMany();
  }

  async create(disponibilite: Disponibilite): Promise<Disponibilite> {
    if (!disponibilite.enseignant?.id_enseignant) {
      throw new Error('Enseignant manquant');
    }

    return await this.disponibiliteRepository.save(disponibilite);
  }

  async update(
    id: number,
    disponibilite: Disponibilite,
  ): Promise<Disponibilite> {
    if (!disponibilite.enseignant?.id_enseignant) {
      throw new Error('Enseignant manquant');
    }
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
