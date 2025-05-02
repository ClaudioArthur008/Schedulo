import { DataSource } from 'typeorm';
import { Utilisateur } from './Utilisateur/utilisateur.entity';
import { Etudiant } from './Utilisateur/Etudiant/etudiant.entity';
import { Enseignant } from './Utilisateur/Enseignant/enseignant.entity';
import { Cours } from './Cours/cours.entity';
import { Niveau } from './Niveau/niveau.entity';
import { Matiere } from './Matiere/matiere.entity';
import { Disponibilite } from './Disponibilite/disponibilite.entity';
import { Classe } from './Classe/classe.entity';
import { Parcours } from './Parcours/parcours.entity';
import { Mention } from './Mention/mention.entity';
import { Salle } from './Salle/salle.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'PostgreSQLPwd13',
  database: 'gestion_emploi_temps',
  entities: [
    Utilisateur,
    Etudiant,
    Enseignant,
    Salle,
    Mention,
    Parcours,
    Classe,
    Disponibilite,
    Matiere,
    Niveau,
    Cours,
  ],
  migrations: ['src/Migrations/*.ts'],
  synchronize: false,
});
