import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class UsersPermissions1638365360587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users_permissions',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'client_id',
                    type: 'uuid'
                },
                {
                    name: 'permission_id',
                    type: 'int'
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()'
                }
            ],
            foreignKeys: [
                {
                    name: 'FKClientID',
                    referencedTableName: 'clients',
                    referencedColumnNames: ['id'],
                    columnNames: ['client_id'],
                    onDelete: 'SET NULL'
                },
                {
                    name: 'FKPermissionID',
                    referencedTableName: 'permissions',
                    referencedColumnNames: ['id'],
                    columnNames: ['permission_id'],
                    onDelete: 'SET NULL'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_permissions')
    }

}
