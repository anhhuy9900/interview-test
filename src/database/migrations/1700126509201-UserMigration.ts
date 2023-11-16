import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1700126509201 implements MigrationInterface {
  name = 'UserMigration1700126509201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user-data" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "s3Key" character varying NOT NULL, "fileType" character varying, "fileSize" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_9d1aa63033ca5bae9ea064098ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "quotaLimit" integer NOT NULL DEFAULT '10485760', "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-data" ADD CONSTRAINT "FK_1ea996fd926e5ac7738fdddbbf4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user-data" DROP CONSTRAINT "FK_1ea996fd926e5ac7738fdddbbf4"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user-data"`);
  }
}
