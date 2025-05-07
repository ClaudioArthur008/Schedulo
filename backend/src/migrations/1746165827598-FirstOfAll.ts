import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstOfAll1746165827598 implements MigrationInterface {
  name = 'FirstOfAll1746165827598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "disponibilite" ("id_disponibilite" SERIAL NOT NULL, "dispo_debut" TIMESTAMP NOT NULL, "dispo_fin" TIMESTAMP NOT NULL, "enseignantIdEnseignant" integer, CONSTRAINT "PK_ee8a49a29d32c8214a091218b0f" PRIMARY KEY ("id_disponibilite"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "niveau" ("id_niveau" character varying NOT NULL, CONSTRAINT "PK_eb426ef5c0a08503563ffe4b096" PRIMARY KEY ("id_niveau"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mention" ("id_mention" SERIAL NOT NULL, "nom_mention" character varying NOT NULL, CONSTRAINT "PK_73c62581969b4ce3404f013b48a" PRIMARY KEY ("id_mention"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "parcours" ("id_parcours" SERIAL NOT NULL, "nom_parcours" character varying NOT NULL, "code_parcours" character varying NOT NULL, "mentionIdMention" integer, CONSTRAINT "PK_bbdd88cf7bf388b03623ace032b" PRIMARY KEY ("id_parcours"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "etudiant" ("matricule" character varying NOT NULL, "classeIdParcours" integer, "classeIdNiveau" character varying, CONSTRAINT "PK_dc8b137ca31f803fb6cd251fbe3" PRIMARY KEY ("matricule"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "classe" ("id_parcours" integer NOT NULL, "id_niveau" character varying NOT NULL, "groupe" integer NOT NULL, "parcoursIdParcours" integer, "niveauIdNiveau" character varying, CONSTRAINT "PK_cae6abb33f2a7e1517e3d3252cc" PRIMARY KEY ("id_parcours", "id_niveau"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "salle" ("id_salle" character varying NOT NULL, CONSTRAINT "PK_28051036d815575c5a626f3d890" PRIMARY KEY ("id_salle"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cours" ("id_parcours" integer NOT NULL, "id_niveau" character varying NOT NULL, "id_matiere" SERIAL NOT NULL, "id_salle" character varying NOT NULL, "cours_debut" TIMESTAMP NOT NULL, "cours_fin" TIMESTAMP NOT NULL, "classeIdParcours" integer, "classeIdNiveau" character varying, "salleIdSalle" character varying, "matiereIdMatiere" integer, CONSTRAINT "PK_614579a3081df1c179249b3f42f" PRIMARY KEY ("id_parcours", "id_niveau", "id_matiere", "id_salle"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "matiere" ("id_matiere" SERIAL NOT NULL, "nom_matiere" character varying NOT NULL, "enseignantIdEnseignant" integer, CONSTRAINT "PK_41dc57c7f885016af6499852024" PRIMARY KEY ("id_matiere"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "enseignant" ("id_enseignant" SERIAL NOT NULL, CONSTRAINT "PK_c99ab3d73c6665875a4e5fdfc17" PRIMARY KEY ("id_enseignant"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "utilisateur" ("id_utilisateur" SERIAL NOT NULL, "email" character varying NOT NULL, "nom" character varying NOT NULL, "prenom" character varying NOT NULL, "mot_passe" character varying NOT NULL, "role" character varying NOT NULL, "approuve" boolean NOT NULL, "enseignantIdEnseignant" integer, "etudiantMatricule" character varying, CONSTRAINT "REL_56cb62a3beaeecf85b9b9357ea" UNIQUE ("enseignantIdEnseignant"), CONSTRAINT "REL_d73ed8309dcf80fac54b43f168" UNIQUE ("etudiantMatricule"), CONSTRAINT "PK_d719cc17b2e613463e34fbae395" PRIMARY KEY ("id_utilisateur"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "disponibilite" ADD CONSTRAINT "FK_e665d6cc6ea0eb8f97eb0a240de" FOREIGN KEY ("enseignantIdEnseignant") REFERENCES "enseignant"("id_enseignant") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcours" ADD CONSTRAINT "FK_197de49fbef96286c4eaccee950" FOREIGN KEY ("mentionIdMention") REFERENCES "mention"("id_mention") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "etudiant" ADD CONSTRAINT "FK_17c277976d4f1a0e79c64511d69" FOREIGN KEY ("classeIdParcours", "classeIdNiveau") REFERENCES "classe"("id_parcours","id_niveau") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classe" ADD CONSTRAINT "FK_f200b4ccfab74c3093426870bdf" FOREIGN KEY ("parcoursIdParcours") REFERENCES "parcours"("id_parcours") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classe" ADD CONSTRAINT "FK_4c78f4133392ad377b10235919d" FOREIGN KEY ("niveauIdNiveau") REFERENCES "niveau"("id_niveau") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cours" ADD CONSTRAINT "FK_22714d88f95873e9509c8459b94" FOREIGN KEY ("classeIdParcours", "classeIdNiveau") REFERENCES "classe"("id_parcours","id_niveau") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cours" ADD CONSTRAINT "FK_0e93455e0256db616a7699148d0" FOREIGN KEY ("salleIdSalle") REFERENCES "salle"("id_salle") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cours" ADD CONSTRAINT "FK_9b349690056fc3b645e1e77dd28" FOREIGN KEY ("matiereIdMatiere") REFERENCES "matiere"("id_matiere") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matiere" ADD CONSTRAINT "FK_14d48c669b2917e04283092b108" FOREIGN KEY ("enseignantIdEnseignant") REFERENCES "enseignant"("id_enseignant") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ADD CONSTRAINT "FK_56cb62a3beaeecf85b9b9357eae" FOREIGN KEY ("enseignantIdEnseignant") REFERENCES "enseignant"("id_enseignant") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ADD CONSTRAINT "FK_d73ed8309dcf80fac54b43f1687" FOREIGN KEY ("etudiantMatricule") REFERENCES "etudiant"("matricule") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "utilisateur" DROP CONSTRAINT "FK_d73ed8309dcf80fac54b43f1687"`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" DROP CONSTRAINT "FK_56cb62a3beaeecf85b9b9357eae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matiere" DROP CONSTRAINT "FK_14d48c669b2917e04283092b108"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cours" DROP CONSTRAINT "FK_9b349690056fc3b645e1e77dd28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cours" DROP CONSTRAINT "FK_0e93455e0256db616a7699148d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cours" DROP CONSTRAINT "FK_22714d88f95873e9509c8459b94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classe" DROP CONSTRAINT "FK_4c78f4133392ad377b10235919d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classe" DROP CONSTRAINT "FK_f200b4ccfab74c3093426870bdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "etudiant" DROP CONSTRAINT "FK_17c277976d4f1a0e79c64511d69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parcours" DROP CONSTRAINT "FK_197de49fbef96286c4eaccee950"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disponibilite" DROP CONSTRAINT "FK_e665d6cc6ea0eb8f97eb0a240de"`,
    );
    await queryRunner.query(`DROP TABLE "utilisateur"`);
    await queryRunner.query(`DROP TABLE "enseignant"`);
    await queryRunner.query(`DROP TABLE "matiere"`);
    await queryRunner.query(`DROP TABLE "cours"`);
    await queryRunner.query(`DROP TABLE "salle"`);
    await queryRunner.query(`DROP TABLE "classe"`);
    await queryRunner.query(`DROP TABLE "etudiant"`);
    await queryRunner.query(`DROP TABLE "parcours"`);
    await queryRunner.query(`DROP TABLE "mention"`);
    await queryRunner.query(`DROP TABLE "niveau"`);
    await queryRunner.query(`DROP TABLE "disponibilite"`);
  }
}
