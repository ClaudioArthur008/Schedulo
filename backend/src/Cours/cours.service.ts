import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Cours, CoursDTO } from './cours.entity';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { Matiere_Classe } from '../Matiere_Classe/matiere_classe.entity';

@Injectable()
export class CoursService {
  constructor(
    @InjectRepository(Cours)
    private readonly coursRepository: Repository<Cours>,
    @InjectRepository(Matiere_Classe)
    private readonly matiereClasseRepository: Repository<Matiere_Classe>,
  ) {}

  async createCours(
    coursDto: CoursDTO,
  ): Promise<{ cours: Cours; qrCode: string }> {
    if (!coursDto.matiere_classes.id_mc) {
      throw new Error('Matière_Classe manquant');
    }

    await occupation(
      coursDto,
      this.coursRepository,
      this.matiereClasseRepository,
    );

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
    return await this.coursRepository.find();
  }

  async getCoursForEnseignantThisWeek(id_enseignant: string): Promise<Cours[]> {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });

    return this.coursRepository.find({
      where: {
        cours_debut: Between(start, end),
        matiere_classes: {
          enseignant: {
            id_enseignant: id_enseignant.toString(),
          },
        },
      },
      relations: [
        'matiere_classes',
        'matiere_classes.enseignant',
        'matiere_classes.classe',
        'matiere_classes.matiere',
        'matiere_classes.classe.parcours',
        'salle',
      ],
      order: { cours_debut: 'ASC' },
    });
  }
  async getCurrentTimeCours(
    id_parcours: number,
    id_niveau: string,
    groupe: string,
  ): Promise<any> {
    const currentTimE = new Date();
    currentTimE.setHours(currentTimE.getHours() - 1);
    currentTimE.setMinutes(currentTimE.getMinutes() - 1);
    currentTimE.setSeconds(currentTimE.getSeconds() - 1);

    const currentTime = getLocalISODate();
    console.log(currentTime);

    const cours = await this.coursRepository
      .createQueryBuilder('cours')
      .innerJoinAndSelect('cours.matiere_classes', 'matiere_classes')
      .innerJoinAndSelect('matiere_classes.classe', 'classe')
      .innerJoinAndSelect('matiere_classes.matiere', 'matiere')
      .where('cours.cours_debut <= :currentTime', { currentTime })
      .andWhere('cours.cours_fin >= :currentTime', { currentTime })
      .andWhere('matiere_classes.classe.id_parcours = :id_parcours', {
        id_parcours,
      })
      .andWhere('matiere_classes.classe.id_niveau = :id_niveau', { id_niveau })
      .andWhere('matiere_classes.classe.groupe = :groupe', { groupe })
      .getOne();

    if (!cours) {
      return {
        message: "Aucun cours trouvé pour l'étudiant à ce crénau actuellement",
      };
    }
    const qrCodeData = JSON.stringify({
      id_cours: cours.id_cours,
      token: cours.qrCodeToken,
    });
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    return { ...cours, qrCodeImage };
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

  async AllCoursForEnseignant(id_enseignant: string): Promise<Cours[]> {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return this.coursRepository.find({
      where: {
        cours_debut: Between(start, end),
        matiere_classes: {
          enseignant: {
            id_enseignant: id_enseignant.toString(),
          },
        },
      },
      relations: [
        'matiere_classes',
        'matiere_classes.enseignant',
        'matiere_classes.classe',
        'matiere_classes.matiere',
        'matiere_classes.classe.parcours',
        'salle',
      ],
      order: { cours_debut: 'ASC' },
    });
  }

  async getAllCoursThisWeek(
    id_parcours: number,
    id_niveau: string,
    groupe: string,
  ): Promise<Cours[]> {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay()),
    );
    const endOfWeek = new Date(today.setDate(today.getDate() + 6));
    return this.coursRepository
      .createQueryBuilder('cours')
      .innerJoinAndSelect('cours.matiere_classes', 'matiere_classes')
      .innerJoinAndSelect('matiere_classes.classe', 'classe')
      .innerJoinAndSelect('matiere_classes.matiere', 'matiere')
      .where('cours.cours_debut >= :startOfWeek', { startOfWeek })
      .andWhere('cours.cours_fin <= :endOfWeek', { endOfWeek })
      .andWhere('matiere_classes.classe.id_parcours = :id_parcours', {
        id_parcours,
      })
      .andWhere('matiere_classes.classe.id_niveau = :id_niveau', { id_niveau })
      .andWhere('matiere_classes.classe.groupe = :groupe', { groupe })
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

async function occupation(
  coursDto: CoursDTO,
  coursRepository: Repository<Cours>,
  matiereClasseRepository: Repository<Matiere_Classe>,
) {
  const id_salle = coursDto.salle.id_salle;
  const debut = coursDto.cours_debut;
  const salleOccupation = await coursRepository
    .createQueryBuilder('cours')
    .innerJoinAndSelect('cours.salle', 'salle')
    .where('salle.id_salle = :id_salle', { id_salle })
    .andWhere('cours.cours_debut <= :debut', { debut })
    .andWhere('cours.cours_fin > :debut', { debut })
    .getOne();

  if (salleOccupation) {
    throw new Error(
      `Cette salle est déjà occupée à cette heure, elle sera disponible à partir de ${salleOccupation.cours_fin}`,
    );
  }

  const matiereClasse = await matiereClasseRepository.findOne({
    where: { id_mc: coursDto.matiere_classes.id_mc },
    relations: ['enseignant'],
  });
  if (!matiereClasse) {
    throw new Error('Matière_Classe introuvable');
  }

  const enseignantOccupation = await coursRepository
    .createQueryBuilder('cours')
    .innerJoin('cours.matiere_classes', 'matiere_classes')
    .innerJoin('matiere_classes.enseignant', 'enseignant')
    .where('enseignant.id_enseignant = :id_enseignant', {
      id_enseignant: matiereClasse.enseignant.id_enseignant,
    })
    .andWhere('cours.cours_debut <= :debut', { debut })
    .andWhere('cours.cours_fin > :debut', { debut })
    .getOne();

  if (enseignantOccupation) {
    throw new Error(
      `Cet enseignant est déjà occupé à cette heure, il sera disponible à partir de ${enseignantOccupation.cours_fin}`,
    );
  }
}

function getLocalISODate(): string {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function startOfWeek(date: Date, options: { weekStartsOn: number }): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0; // 0 = Sunday, 1 = Monday, etc.
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

function endOfWeek(date: Date, options: { weekStartsOn: number }): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0; // 0 = Sunday, 1 = Monday, etc.
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setHours(23, 59, 59, 999);
  d.setDate(d.getDate() - diff + 6);
  return d;
}
