import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1746645406191 implements MigrationInterface {
    name = 'InitialCreate1746645406191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "disponibilite" ("id_disponibilite" SERIAL NOT NULL, "dispo_debut" TIMESTAMP NOT NULL, "dispo_fin" TIMESTAMP NOT NULL, "enseignantIdEnseignant" character varying, CONSTRAINT "PK_ee8a49a29d32c8214a091218b0f" PRIMARY KEY ("id_disponibilite"))`);
        await queryRunner.query(`CREATE TABLE "salle" ("id_salle" character varying NOT NULL, CONSTRAINT "PK_28051036d815575c5a626f3d890" PRIMARY KEY ("id_salle"))`);
        await queryRunner.query(`CREATE TABLE "cours" ("id_cours" SERIAL NOT NULL, "cours_debut" TIMESTAMP NOT NULL, "cours_fin" TIMESTAMP NOT NULL, "status" integer NOT NULL DEFAULT '0', "qrCodeToken" character varying NOT NULL, "matiereClassesIdMc" integer, "salleIdSalle" character varying, CONSTRAINT "UQ_f955ba0e910d5219640463b2276" UNIQUE ("qrCodeToken"), CONSTRAINT "PK_6ca76c458a728cddd25fa9daecc" PRIMARY KEY ("id_cours"))`);
        await queryRunner.query(`CREATE TABLE "niveau" ("id_niveau" character varying NOT NULL, CONSTRAINT "PK_eb426ef5c0a08503563ffe4b096" PRIMARY KEY ("id_niveau"))`);
        await queryRunner.query(`CREATE TABLE "mention" ("id_mention" SERIAL NOT NULL, "nom_mention" character varying NOT NULL, CONSTRAINT "PK_73c62581969b4ce3404f013b48a" PRIMARY KEY ("id_mention"))`);
        await queryRunner.query(`CREATE TABLE "parcours" ("id_parcours" SERIAL NOT NULL, "nom_parcours" character varying NOT NULL, "code_parcours" character varying NOT NULL, "mentionIdMention" integer, CONSTRAINT "PK_bbdd88cf7bf388b03623ace032b" PRIMARY KEY ("id_parcours"))`);
        await queryRunner.query(`CREATE TABLE "etudiant" ("matricule" character varying NOT NULL, "nom" character varying NOT NULL, "prenom" character varying NOT NULL, "titre" integer NOT NULL, "classeIdParcours" integer, "classeIdNiveau" character varying, "classeGroupe" integer, CONSTRAINT "UQ_9e2fce79ce023457211a0a9029a" UNIQUE ("prenom"), CONSTRAINT "PK_dc8b137ca31f803fb6cd251fbe3" PRIMARY KEY ("matricule"))`);
        await queryRunner.query(`CREATE TABLE "classe" ("id_parcours" integer NOT NULL, "id_niveau" character varying NOT NULL, "groupe" integer NOT NULL, "parcoursIdParcours" integer, "niveauIdNiveau" character varying, CONSTRAINT "PK_f6dd698e1c07e22076363f106af" PRIMARY KEY ("id_parcours", "id_niveau", "groupe"))`);
        await queryRunner.query(`CREATE TABLE "matiere" ("id_matiere" SERIAL NOT NULL, "nom_matiere" character varying NOT NULL, CONSTRAINT "PK_41dc57c7f885016af6499852024" PRIMARY KEY ("id_matiere"))`);
        await queryRunner.query(`CREATE TABLE "matiere_classe" ("id_mc" SERIAL NOT NULL, "matiereIdMatiere" integer, "classeIdParcours" integer, "classeIdNiveau" character varying, "classeGroupe" integer, "enseignantIdEnseignant" character varying NOT NULL, CONSTRAINT "PK_4ef251d00cb0600d668b7f8b14d" PRIMARY KEY ("id_mc"))`);
        await queryRunner.query(`CREATE TABLE "enseignant" ("id_enseignant" character varying NOT NULL, "nom" character varying NOT NULL, "prenom" character varying NOT NULL, CONSTRAINT "UQ_c5aaf6a44be700d0519099c33a1" UNIQUE ("prenom"), CONSTRAINT "PK_c99ab3d73c6665875a4e5fdfc17" PRIMARY KEY ("id_enseignant"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id_notification" SERIAL NOT NULL, "utilisateurIdUtilisateur" integer, CONSTRAINT "PK_5eeade67aa70b7db4a6bdd4dcd8" PRIMARY KEY ("id_notification"))`);
        await queryRunner.query(`CREATE TABLE "utilisateur" ("id_utilisateur" SERIAL NOT NULL, "email" character varying NOT NULL, "mot_passe" character varying NOT NULL, "role" character varying NOT NULL, "approuve" boolean NOT NULL DEFAULT false, "enseignantIdEnseignant" character varying, "etudiantMatricule" character varying, CONSTRAINT "UQ_e1136325a6b28e2a02b81b2f5e1" UNIQUE ("email"), CONSTRAINT "REL_56cb62a3beaeecf85b9b9357ea" UNIQUE ("enseignantIdEnseignant"), CONSTRAINT "REL_d73ed8309dcf80fac54b43f168" UNIQUE ("etudiantMatricule"), CONSTRAINT "PK_d719cc17b2e613463e34fbae395" PRIMARY KEY ("id_utilisateur"))`);
        await queryRunner.query(`CREATE TABLE "presence" ("id" SERIAL NOT NULL, "dateHeureScan" TIMESTAMP NOT NULL, "etudiantMatricule" character varying, "coursIdCours" integer, CONSTRAINT "PK_e0088b38d7cf2dc6ad815d33e7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "disponibilite" ADD CONSTRAINT "FK_e665d6cc6ea0eb8f97eb0a240de" FOREIGN KEY ("enseignantIdEnseignant") REFERENCES "enseignant"("id_enseignant") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cours" ADD CONSTRAINT "FK_df0d264e2a056960b1187201d5a" FOREIGN KEY ("matiereClassesIdMc") REFERENCES "matiere_classe"("id_mc") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cours" ADD CONSTRAINT "FK_0e93455e0256db616a7699148d0" FOREIGN KEY ("salleIdSalle") REFERENCES "salle"("id_salle") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parcours" ADD CONSTRAINT "FK_197de49fbef96286c4eaccee950" FOREIGN KEY ("mentionIdMention") REFERENCES "mention"("id_mention") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "etudiant" ADD CONSTRAINT "FK_6888441edfe4f8a5434c523f209" FOREIGN KEY ("classeIdParcours", "classeIdNiveau", "classeGroupe") REFERENCES "classe"("id_parcours","id_niveau","groupe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classe" ADD CONSTRAINT "FK_f200b4ccfab74c3093426870bdf" FOREIGN KEY ("parcoursIdParcours") REFERENCES "parcours"("id_parcours") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classe" ADD CONSTRAINT "FK_4c78f4133392ad377b10235919d" FOREIGN KEY ("niveauIdNiveau") REFERENCES "niveau"("id_niveau") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matiere_classe" ADD CONSTRAINT "FK_38f43eb6d27dfe86f9d410a1890" FOREIGN KEY ("matiereIdMatiere") REFERENCES "matiere"("id_matiere") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matiere_classe" ADD CONSTRAINT "FK_9fcef49a3fe0c00cecfdec3edb0" FOREIGN KEY ("classeIdParcours", "classeIdNiveau", "classeGroupe") REFERENCES "classe"("id_parcours","id_niveau","groupe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matiere_classe" ADD CONSTRAINT "FK_b5c965cdb873d8c76e78e2d0309" FOREIGN KEY ("enseignantIdEnseignant") REFERENCES "enseignant"("id_enseignant") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c6fe1fc9229417ad2c70e94384a" FOREIGN KEY ("utilisateurIdUtilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utilisateur" ADD CONSTRAINT "FK_56cb62a3beaeecf85b9b9357eae" FOREIGN KEY ("enseignantIdEnseignant") REFERENCES "enseignant"("id_enseignant") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utilisateur" ADD CONSTRAINT "FK_d73ed8309dcf80fac54b43f1687" FOREIGN KEY ("etudiantMatricule") REFERENCES "etudiant"("matricule") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "presence" ADD CONSTRAINT "FK_fb822304d04f7ce4b1f9e3f94c9" FOREIGN KEY ("etudiantMatricule") REFERENCES "etudiant"("matricule") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "presence" ADD CONSTRAINT "FK_e5054f11a5ad6c961e81a4c3c34" FOREIGN KEY ("coursIdCours") REFERENCES "cours"("id_cours") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "presence" DROP CONSTRAINT "FK_e5054f11a5ad6c961e81a4c3c34"`);
        await queryRunner.query(`ALTER TABLE "presence" DROP CONSTRAINT "FK_fb822304d04f7ce4b1f9e3f94c9"`);
        await queryRunner.query(`ALTER TABLE "utilisateur" DROP CONSTRAINT "FK_d73ed8309dcf80fac54b43f1687"`);
        await queryRunner.query(`ALTER TABLE "utilisateur" DROP CONSTRAINT "FK_56cb62a3beaeecf85b9b9357eae"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c6fe1fc9229417ad2c70e94384a"`);
        await queryRunner.query(`ALTER TABLE "matiere_classe" DROP CONSTRAINT "FK_b5c965cdb873d8c76e78e2d0309"`);
        await queryRunner.query(`ALTER TABLE "matiere_classe" DROP CONSTRAINT "FK_9fcef49a3fe0c00cecfdec3edb0"`);
        await queryRunner.query(`ALTER TABLE "matiere_classe" DROP CONSTRAINT "FK_38f43eb6d27dfe86f9d410a1890"`);
        await queryRunner.query(`ALTER TABLE "classe" DROP CONSTRAINT "FK_4c78f4133392ad377b10235919d"`);
        await queryRunner.query(`ALTER TABLE "classe" DROP CONSTRAINT "FK_f200b4ccfab74c3093426870bdf"`);
        await queryRunner.query(`ALTER TABLE "etudiant" DROP CONSTRAINT "FK_6888441edfe4f8a5434c523f209"`);
        await queryRunner.query(`ALTER TABLE "parcours" DROP CONSTRAINT "FK_197de49fbef96286c4eaccee950"`);
        await queryRunner.query(`ALTER TABLE "cours" DROP CONSTRAINT "FK_0e93455e0256db616a7699148d0"`);
        await queryRunner.query(`ALTER TABLE "cours" DROP CONSTRAINT "FK_df0d264e2a056960b1187201d5a"`);
        await queryRunner.query(`ALTER TABLE "disponibilite" DROP CONSTRAINT "FK_e665d6cc6ea0eb8f97eb0a240de"`);
        await queryRunner.query(`DROP TABLE "presence"`);
        await queryRunner.query(`DROP TABLE "utilisateur"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "enseignant"`);
        await queryRunner.query(`DROP TABLE "matiere_classe"`);
        await queryRunner.query(`DROP TABLE "matiere"`);
        await queryRunner.query(`DROP TABLE "classe"`);
        await queryRunner.query(`DROP TABLE "etudiant"`);
        await queryRunner.query(`DROP TABLE "parcours"`);
        await queryRunner.query(`DROP TABLE "mention"`);
        await queryRunner.query(`DROP TABLE "niveau"`);
        await queryRunner.query(`DROP TABLE "cours"`);
        await queryRunner.query(`DROP TABLE "salle"`);
        await queryRunner.query(`DROP TABLE "disponibilite"`);
    }

}
