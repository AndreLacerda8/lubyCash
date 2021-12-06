import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddColumnNameInClients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('full_name')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('full_name')
    })
  }
}
