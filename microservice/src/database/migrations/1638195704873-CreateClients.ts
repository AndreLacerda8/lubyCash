import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateClients1638195704873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'clients',
            columns: [
                {
                    name: 'id',
                    type: 'char(36)',
                    isPrimary: true,
                },
                {
                    name: 'full_name',
                    type: 'varchar'
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar'
                },
                {
                    name: 'phone',
                    type: 'varchar'
                },
                {
                    name: 'cpf_number',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'address',
                    type: 'varchar'
                },
                {
                    name: 'city',
                    type: 'varchar'
                },
                {
                    name: 'state',
                    type: 'varchar'
                },
                {
                    name: 'zipcode',
                    type: 'varchar'
                },
                {
                    name: 'current_balance',
                    type: 'varchar'
                },
                {
                    name: 'average_salary',
                    type: 'varchar'
                },
                {
                    name: 'status',
                    type: 'varchar'
                },
                {
                    name: 'status_date',
                    type: 'datetime'
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('clients')
    }

}
