import { Server, Socket } from 'socket.io';

export class NotificationService {
  private server: Server;
  // Map qui associe les ID utilisateurs aux ID de sockets
  private users: Map<string, string> = new Map();

  constructor(server: Server) {
    this.server = server;
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connecté: ${socket.id}`);

      // Récupérer l'userId depuis les paramètres de requête lors de la connexion
      const userId = socket.handshake.query.userId as string;
      if (userId) {
        this.registerUser(userId, socket.id);
        console.log(
          `User ${userId} automatiquement enregistré sur socket ${socket.id}`,
        );
      }

      // Gestion de l'enregistrement explicite
      socket.on('register', (data: { userId: string | number }) => {
        const userId = data.userId.toString();
        this.registerUser(userId, socket.id);
        console.log(`User ${userId} enregistré sur socket ${socket.id}`);

        // Confirmer l'enregistrement au client
        socket.emit('registered', { success: true, userId });
      });

      socket.on('disconnect', () => {
        console.log(`Client déconnecté: ${socket.id}`);
        this.removeSocketUser(socket.id);
      });
    });
  }

  // Enregistre l'association utilisateur-socket
  private registerUser(userId: string, socketId: string) {
    this.users.set(userId, socketId);
  }

  // Supprime l'association socket-utilisateur lors de la déconnexion
  private removeSocketUser(socketId: string) {
    for (const [userId, sid] of this.users.entries()) {
      if (sid === socketId) {
        this.users.delete(userId);
        console.log(
          `Association supprimée pour l'utilisateur avec socket ${socketId}`,
        );
      }
    }
  }

  // Envoie une notification à un utilisateur spécifique
  public sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.users.get(userId);

    console.log(`Tentative d'envoi de notification à l'utilisateur ${userId}`);
    console.log(`Map des utilisateurs:`, Object.fromEntries(this.users));

    if (!socketId) {
      console.log(`Utilisateur ${userId} non trouvé dans la map.`);
      return;
    }

    console.log(`Envoi de la notification à l'utilisateur ${userId}`);
    console.log(`Socket ID associé: ${socketId}`);

    this.server.to(socketId).emit('notification', notification);
  }

  // Méthode de débogage pour afficher tous les utilisateurs connectés
  public logConnectedUsers() {
    console.log('Utilisateurs connectés:', Object.fromEntries(this.users));
  }
}
