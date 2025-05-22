import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1747748119835 implements MigrationInterface {
    name = 'InitialCreate1747748119835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c6fe1fc9229417ad2c70e94384a"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "titre" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "message" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "lu" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" character varying NOT NULL DEFAULT 'info'`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "date_creation" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c6fe1fc9229417ad2c70e94384a" FOREIGN KEY ("utilisateurIdUtilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c6fe1fc9229417ad2c70e94384a"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "date_creation"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "lu"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "titre"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c6fe1fc9229417ad2c70e94384a" FOREIGN KEY ("utilisateurIdUtilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
