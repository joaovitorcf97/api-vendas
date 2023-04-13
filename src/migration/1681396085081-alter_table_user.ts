import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUser1681396085081 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('alter')
        queryRunner.query(`
            alter table public.user add unique(email);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        `);
    }

}
