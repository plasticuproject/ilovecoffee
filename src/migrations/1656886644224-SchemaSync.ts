import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1656886644224 implements MigrationInterface {
  name = 'SchemaSync1656886644224';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "coffee" ADD "description" character varying',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "coffee" DROP COLUMN "description"',
    );
  }
}
