import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { Public } from './../auth/decorator/public.decorator';
import { EtudiantService } from '../Utilisateur/Etudiant/etudiant.service';
import { UtilisateurService } from '../Utilisateur/utilisateur.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Public()
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly etudiantRepository: EtudiantService,
    private readonly utilisateurRepository: UtilisateurService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

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

  async notifyClasse(
    parcours: number,
    niveau: string,
    groupe: number,
    titre: string,
    message: string,
    type: string = 'info',
  ) {
    // Récupère tous les étudiants de cette classe
    const etudiants = await this.etudiantRepository.findEtudiantsByClasseId(
      parcours,
      niveau,
      groupe,
    );

    for (const etu of etudiants) {
      // Il faut récupérer l'ID de l'utilisateur associé à l'étudiant
      // Supposons que l'étudiant a un champ id_utilisateur ou similaire
      const notification = new Notification();
      notification.titre = titre;
      notification.message = message;
      notification.type = type;
      notification.lu = false;

      // Supposons que nous devons récupérer l'utilisateur séparément
      const utilisateur = await this.utilisateurRepository.findByEtudiant(
        etu.matricule,
      );
      notification.utilisateur = utilisateur[0];

      // Utiliser le repository de notification directement
      await this.notificationService.create(notification);

      // Vérifier si le service de websocket est disponible
      if (this.notificationsGateway) {
        this.notificationsGateway.sendNotificationToUser(
          String(utilisateur[0].id_utilisateur), // Utiliser l'ID utilisateur de l'étudiant
          {
            titre,
            message,
            type,
            timestamp: new Date().toISOString(),
          },
        );
      }
    }
  }
}
