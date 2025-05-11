import { DataSource } from 'typeorm';
import { Utilisateur } from './Utilisateur/utilisateur.entity';
import { Etudiant } from './Utilisateur/Etudiant/etudiant.entity';
import { Enseignant } from './Utilisateur/Enseignant/enseignant.entity';
import { Salle } from './Salle/salle.entity';
import { Mention } from './Mention/mention.entity';
import { Parcours } from './Parcours/parcours.entity';
import { Classe } from './Classe/classe.entity';
import { Disponibilite } from './Disponibilite/disponibilite.entity';
import { Matiere } from './Matiere/matiere.entity';
import { Niveau } from './Niveau/niveau.entity';
import { Cours } from './Cours/cours.entity';
import { Presence } from './Presence/presence.entity';
import { Notification } from './Notification/notification.entity';
import { Matiere_Classe } from './Matiere_Classe/matiere_classe.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'gestion-emploi-temps',
  entities: [
    Utilisateur,
    Etudiant,
    Enseignant,
    Salle,
    Mention,
    Parcours,
    Classe,
    Presence,
    Notification,
    Matiere_Classe,
    Disponibilite,
    Matiere,
    Niveau,
    Cours,
  ],
  migrations: ['src/Migrations/*.ts'],
  synchronize: false,
});
