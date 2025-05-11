import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { Public } from './../auth/decorator/public.decorator';

@Public()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAll(): Promise<Notification[]> {
    return this.notificationService.getAll();
  }

  @Get(':id')
  async getById(id: number): Promise<Notification> {
    return this.notificationService.getById(id);
  }

  @Post()
  async create(notification: Notification): Promise<Notification> {
    return this.notificationService.create(notification);
  }

  @Put(':id')
  async update(id: number, notification: Notification): Promise<Notification> {
    return this.notificationService.update(id, notification);
  }

  @Delete(':id')
  async delete(id: number): Promise<void> {
    return this.notificationService.delete(id);
  }

  @Delete()
  async deleteAll(): Promise<void> {
    return this.notificationService.deleteAll();
  }
}
