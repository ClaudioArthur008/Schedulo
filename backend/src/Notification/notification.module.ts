import { Module } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { EtudiantModule } from '../Utilisateur/Etudiant/etudiant.module';
import { UtilisateurModule } from '../Utilisateur/utilisateur.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EtudiantModule,
    UtilisateurModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationsGateway],
})
export class NotificationModule {}
