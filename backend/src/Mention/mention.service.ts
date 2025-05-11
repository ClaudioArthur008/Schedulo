import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mention } from './mention.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentionService {
  constructor(
    @InjectRepository(Mention)
    private readonly mentionRepository: Repository<Mention>,
  ) {}

  async createMention(mention: Partial<Mention>): Promise<Mention> {
    return this.mentionRepository.save(mention);
  }

  async getAllMention(): Promise<Mention[]> {
    return this.mentionRepository.find();
  }

  async update(id: number, mention: Mention): Promise<Mention> {
    const mentionToUpdate = await this.mentionRepository.findOneBy({
      id_mention: id,
    });
    if (!mentionToUpdate) {
      throw new Error('Mention introuvable');
    }
    await this.mentionRepository.update(id, mention);
    return mention;
  }

  async delete(id: number): Promise<void> {
    const mentionToDelete = await this.mentionRepository.findOneBy({
      id_mention: id,
    });
    if (!mentionToDelete) {
      throw new Error('Mention introuvable');
    }
    await this.mentionRepository.delete(id);
  }

  async getAllParcoursforMention(id_mention: number): Promise<Mention[]> {
    return this.mentionRepository
      .createQueryBuilder('mention')
      .innerJoinAndSelect('mention.parcours', 'parcours')
      .where('mention.id_mention = :id_mention', { id_mention })
      .getMany();
  }
}
