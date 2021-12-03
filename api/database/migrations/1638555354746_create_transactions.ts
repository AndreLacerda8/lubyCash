import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateTransactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('sender_id').references('id').inTable('clients')
      table.uuid('receiver_id').references('id').inTable('clients')
      table.decimal('amount')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
