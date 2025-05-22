import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Map qui associe les IDs utilisateur aux IDs de socket
  private users = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log('Client connecté:', client.id);

    // Récupérer l'userId depuis les paramètres de requête lors de la connexion
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.users.set(userId, client.id);
      console.log(
        `User ${userId} automatiquement enregistré sur socket ${client.id}`,
      );

      // Confirmer l'enregistrement au client
      client.emit('registered', { success: true, userId });
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client déconnecté:', client.id);

    // Supprimer le user lié
    for (const [userId, socketId] of this.users.entries()) {
      if (socketId === client.id) {
        this.users.delete(userId);
        console.log(`Association supprimée pour l'utilisateur ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = data.userId.toString(); // Assurer que c'est une chaîne
    console.log(
      `User ${userId} enregistré explicitement sur socket ${client.id}`,
    );

    // Enregistrer l'association
    this.users.set(userId, client.id);

    // Confirmer l'enregistrement
    client.emit('registered', { success: true, userId });

    // Log pour débogage
    console.log(
      'État actuel des utilisateurs connectés:',
      Object.fromEntries(this.users),
    );

    return { success: true };
  }

  sendNotificationToUser(userId: string, notification: any) {
    // Debug: afficher tous les utilisateurs connectés
    console.log('Utilisateurs connectés:', Object.fromEntries(this.users));
    console.log(`Tentative d'envoi à l'utilisateur ID: ${userId}`);

    // S'assurer que userId est une chaîne
    const userIdStr = userId.toString();

    // Récupérer le socketId correspondant à l'userId
    const socketId = this.users.get(userIdStr);

    if (!socketId) {
      console.log(`Utilisateur ${userIdStr} non trouvé dans la map.`);
      return false;
    }

    console.log(`Envoi de la notification à l'utilisateur ${userIdStr}`);
    console.log(`Socket ID associé: ${socketId}`);

    // Envoyer la notification
    this.server.to(socketId).emit('notification', notification);
    return true;
  }

  // Pour les tests et le débogage
  @SubscribeMessage('testNotification')
  handleTestNotification(
    @MessageBody() data: { userId?: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Si userId est fourni, envoyer à cet utilisateur spécifique
    if (data.userId) {
      const success = this.sendNotificationToUser(data.userId, {
        message: data.message || 'Test de notification',
        type: 'info',
        timestamp: new Date().toISOString(),
      });

      return { success };
    }
    // Sinon, envoyer à l'expéditeur
    else {
      // Trouver l'userId associé à ce socket
      let senderUserId: string | null = null;
      for (const [userId, socketId] of this.users.entries()) {
        if (socketId === client.id) {
          senderUserId = userId;
          break;
        }
      }

      if (senderUserId) {
        return this.sendNotificationToUser(senderUserId, {
          message: data.message || 'Test de notification',
          type: 'info',
          timestamp: new Date().toISOString(),
        });
      } else {
        return { success: false, message: 'Utilisateur non enregistré' };
      }
    }
  }
}
