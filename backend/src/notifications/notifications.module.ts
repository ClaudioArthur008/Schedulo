import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { UtilisateurModule } from '../Utilisateur/utilisateur.module';

@Module({
  imports: [UtilisateurModule],
  providers: [NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
