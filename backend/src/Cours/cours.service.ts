import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cours, CoursDTO } from './cours.entity';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class CoursService {
  constructor(
    @InjectRepository(Cours)
    private readonly coursRepository: Repository<Cours>,
  ) {}

  async createCours(
    coursDto: CoursDTO,
  ): Promise<{ cours: Cours; qrCode: string }> {
    if (!coursDto.matiere_classes.id_mc) {
      throw new Error('Matière_Classe manquant');
    }
    const token = crypto.randomBytes(16).toString('hex');
    const cours = this.coursRepository.create({
      ...coursDto,
      qrCodeToken: token,
    });
    const saved = await this.coursRepository.save(cours);
    const qrCodeData = JSON.stringify({
      id_cours: saved.id_cours,
      token,
    });
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    return { cours: saved, qrCode: qrCodeImage };
  }

  async getAllCours(): Promise<Cours[]> {
    return this.coursRepository.find();
  }

  async update(id: number, cours: Cours): Promise<Cours> {
    const coursToUpdate = await this.coursRepository.findOneBy({
      id_cours: id,
    });
    if (!coursToUpdate) {
      throw new Error('Cours introuvable');
    }
    await this.coursRepository.update(
      {
        id_cours: cours.id_cours,
      },
      cours,
    );
    return cours;
  }

  async delete(id: number): Promise<void> {
    const coursToDelete = await this.coursRepository.findOneBy({
      id_cours: id,
    });
    if (!coursToDelete) {
      throw new Error('Cours introuvable');
    }
    await this.coursRepository.delete({
      id_cours: id,
    });
  }

  async getAllCoursThisWeek(): Promise<Cours[]> {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay()),
    );
    const endOfWeek = new Date(today.setDate(today.getDate() + 6));
    return this.coursRepository
      .createQueryBuilder('cours')
      .where('cours.cours_debut >= :startOfWeek', { startOfWeek })
      .andWhere('cours.cours_fin <= :endOfWeek', { endOfWeek })
      .getMany();
  }

  async getCoursForSpecificWeek(x: string): Promise<Cours[]> {
    const date = new Date(x);
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(date.getDate() + 6));
    return this.coursRepository
      .createQueryBuilder('cours')
      .where('cours.cours_debut >= :startOfWeek', { startOfWeek })
      .andWhere('cours.cours_fin <= :endOfWeek', { endOfWeek })
      .getMany();
  }

  async getCoursByEnseignant(
    id_enseignant: number,
    date: Date,
  ): Promise<Cours[]> {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(date.getDate() + 6));
    return this.coursRepository
      .createQueryBuilder('cours')
      .innerJoinAndSelect('cours.enseignant', 'enseignant')
      .where('enseignant.id_enseignant = :id_enseignant', { id_enseignant })
      .andWhere('cours.cours_debut >= :startOfWeek', { startOfWeek })
      .andWhere('cours.cours_fin <= :endOfWeek', { endOfWeek })
      .getMany();
  }
}
