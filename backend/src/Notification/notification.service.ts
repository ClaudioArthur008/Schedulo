import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async getById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOneBy({
      id_notification: id,
    });
    if (!notification) {
      throw new Error(`Notification introuvable`);
    }
    return notification;
  }

  async create(notification: Notification): Promise<Notification> {
    return this.notificationRepository.save(notification);
  }

  async update(id: number, notification: Notification): Promise<Notification> {
    await this.notificationRepository.update(id, notification);
    return this.getById(id);
  }
  async delete(id: number): Promise<void> {
    const notification = await this.getById(id);
    await this.notificationRepository.remove(notification);
  }

  async deleteAll(): Promise<void> {
    await this.notificationRepository.clear();
  }
}
