import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Public } from './../auth/decorator/public.decorator';
import { Role } from '../Utilisateur/utilisateur.entity';
import { UtilisateurService } from '../Utilisateur/utilisateur.service';

@Public()
@Controller('notifications')
export class NotificationsController {
  constructor(
    public readonly notificationsGateway: NotificationsGateway,
    private readonly utilisateurRepository: UtilisateurService,
  ) {}

  @Post('send')
  sendNotification(
    @Body() data: { userId: string; message: string; type?: string },
  ) {
    console.log("Demande d'envoi de notification à l'utilisateur", data.userId);

    const success = this.notificationsGateway.sendNotificationToUser(
      data.userId,
      {
        message: data.message,
        type: data.type || 'info',
        timestamp: new Date().toISOString(),
      },
    );

    return {
      success,
      message: success
        ? 'Notification envoyée'
        : 'Utilisateur non connecté ou non trouvé',
      notification: {
        message: data.message,
        type: data.type || 'info',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('notification-par-role')
  async sendNotificationToRole(
    @Body() data: { role: Role; message: string; type?: string },
  ) {
    const utilisateurs = await this.utilisateurRepository.findByRole(data.role);
    let count = 0;
    for (const user of utilisateurs) {
      this.notificationsGateway.sendNotificationToUser(
        user.id_utilisateur.toString(),
        {
          message: data.message,
          type: data.type || 'info',
          timestamp: new Date().toISOString(),
        },
      );
      count++;
    }

    return {
      success: true,
      message: `Notification envoyée à ${count} utilisateur(s) avec le rôle ${data.role}`,
    };
  }

  @Post('test')
  testNotification(@Body() data: { userId: string; message: string }) {
    console.log("Test de notification pour l'utilisateur", data.userId);

    const success = this.notificationsGateway.sendNotificationToUser(
      data.userId,
      {
        message:
          data.message ||
          `Test de notification pour l'utilisateur ${data.userId} à ${new Date().toLocaleTimeString()}`,
        type: 'info',
        timestamp: new Date().toISOString(),
      },
    );

    return {
      success,
      message: success
        ? 'Notification envoyée'
        : 'Utilisateur non connecté ou non trouvé',
    };
  }
}
