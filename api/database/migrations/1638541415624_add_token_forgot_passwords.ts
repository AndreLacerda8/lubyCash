import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddTokenForgotPasswords extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('token_forgot_password')
      table.timestamp('token_forgot_password_created_at')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('token_forgot_password')
      table.dropColumn('token_forgot_password_created_at')
    })
  }
}
