import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1656886584363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "coffee" RENAME COLUMN "name" to "title"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "coffee" RENAME COLUMN "title" to "name"',
    );
  }
}
